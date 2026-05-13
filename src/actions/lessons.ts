"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { LessonStatus, EscrowStatus, InstructorStatus } from "@prisma/client";
import { createPaymentIntent } from "@/lib/stripe";
import { enqueueNotificationJob } from "@/lib/qstash";
import { z } from "zod";

const BookLessonSchema = z.object({
  instructorId: z.string().cuid(),
  vehicleId: z.string().optional(), // optional — server picks primary vehicle if omitted
  scheduledAt: z.string().datetime(),
  durationMin: z.number().int().min(50).max(120).default(60),
  meetingPoint: z.string().min(5, "Informe o ponto de encontro"),
});

export type BookLessonInput = z.infer<typeof BookLessonSchema>;

// ─── Book a lesson ────────────────────────────────────────────────────────────

export async function bookLesson(
  input: BookLessonInput,
): Promise<ActionResult<{ lessonId: string; clientSecret: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return err("Não autorizado");

  const parsed = BookLessonSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { instructorId, scheduledAt, durationMin, meetingPoint } = parsed.data;

  const [studentProfile, instructorProfile] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.instructorProfile.findUnique({ where: { id: instructorId, status: InstructorStatus.ACTIVE } }),
  ]);

  if (!studentProfile) return err("Perfil de aluno não encontrado");
  if (!instructorProfile) return err("Instrutor não disponível");
  if (!instructorProfile.stripeAccountId) return err("Instrutor ainda não configurou o pagamento");

  // Resolve vehicle — use provided vehicleId or pick primary/first active
  let vehicle;
  if (parsed.data.vehicleId) {
    vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.data.vehicleId, active: true } });
    if (!vehicle || vehicle.instructorId !== instructorId) return err("Veículo inválido");
  } else {
    vehicle = await prisma.vehicle.findFirst({
      where: { instructorId, active: true },
      orderBy: { isPrimary: "desc" },
    });
    if (!vehicle) return err("Instrutor sem veículo cadastrado");
  }

  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) return err("Horário deve ser no futuro");

  // Check for slot conflicts
  const conflict = await prisma.lesson.findFirst({
    where: {
      instructorId,
      status: { in: [LessonStatus.PENDING, LessonStatus.CONFIRMED] },
      scheduledAt: {
        gte: new Date(scheduledDate.getTime() - durationMin * 60 * 1000),
        lt: new Date(scheduledDate.getTime() + durationMin * 60 * 1000),
      },
    },
  });
  if (conflict) return err("Horário indisponível. Escolha outro horário.");

  const priceAmount = Number(instructorProfile.pricePerLesson);
  const amountCents = Math.round(priceAmount * 100);

  // Pre-create lesson to get lessonId for Stripe metadata
  const lesson = await prisma.lesson.create({
    data: {
      studentId: studentProfile.id,
      instructorId,
      vehicleId: vehicle.id,
      scheduledAt: scheduledDate,
      durationMin,
      meetingPoint,
      priceAmount: priceAmount,
      escrowStatus: EscrowStatus.HELD,
    },
  });

  // Create Stripe PaymentIntent with manual capture (escrow)
  let paymentIntent;
  try {
    paymentIntent = await createPaymentIntent({
      amountCents,
      stripeAccountId: instructorProfile.stripeAccountId,
      lessonId: lesson.id,
      studentId: studentProfile.id,
      instructorId,
    });
  } catch (e) {
    console.error("[bookLesson] stripe error", e);
    await prisma.lesson.delete({ where: { id: lesson.id } });
    return err("Erro ao processar pagamento. Tente novamente.");
  }

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  await enqueueNotificationJob({
    type: "lesson.booked",
    idempotencyKey: `lesson.booked:${lesson.id}`,
    payload: {
      lessonId: lesson.id,
      studentId: studentProfile.id,
      instructorId,
      scheduledAt: scheduledDate.toISOString(),
    },
  });

  return ok({ lessonId: lesson.id, clientSecret: paymentIntent.client_secret! });
}

// ─── Get instructor availability ──────────────────────────────────────────────

export async function getInstructorAvailability(
  instructorId: string,
): Promise<ActionResult<{ dayOfWeek: number; startTime: string; endTime: string }[]>> {
  const slots = await prisma.availability.findMany({
    where: { instructorId, active: true },
    select: { dayOfWeek: true, startTime: true, endTime: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
  return ok(slots);
}

// ─── Get booked slots (for a given instructor + date range) ───────────────────

export async function getBookedSlots(
  instructorId: string,
  from: Date,
  to: Date,
): Promise<ActionResult<{ scheduledAt: string; durationMin: number }[]>> {
  const lessons = await prisma.lesson.findMany({
    where: {
      instructorId,
      status: { in: [LessonStatus.PENDING, LessonStatus.CONFIRMED] },
      scheduledAt: { gte: from, lte: to },
    },
    select: { scheduledAt: true, durationMin: true },
  });

  return ok(lessons.map((l) => ({ scheduledAt: l.scheduledAt.toISOString(), durationMin: l.durationMin })));
}

// ─── Save instructor availability ─────────────────────────────────────────────

const AvailabilitySlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function saveAvailability(
  slots: z.infer<typeof AvailabilitySlotSchema>[],
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const profile = await prisma.instructorProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return err("Perfil não encontrado");

  // Replace all availability for this instructor
  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { instructorId: profile.id } }),
    prisma.availability.createMany({
      data: slots.map((s) => ({ ...s, instructorId: profile.id })),
      skipDuplicates: true,
    }),
  ]);

  return ok(undefined);
}

// ─── Confirm lesson completion ────────────────────────────────────────────────

export async function confirmLessonCompletion(
  lessonId: string,
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return err("Não autorizado");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      student: { select: { userId: true } },
      instructor: { select: { userId: true, stripeAccountId: true } },
    },
  });

  if (!lesson || lesson.status !== LessonStatus.CONFIRMED) return err("Aula não encontrada ou inválida");

  const isStudent = lesson.student.userId === session.user.id;
  const isInstructor = lesson.instructor.userId === session.user.id;
  if (!isStudent && !isInstructor) return err("Não autorizado");

  const update = isStudent
    ? { studentConfirmed: true }
    : { instructorConfirmed: true };

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: update,
  });

  // Both confirmed — release escrow
  if (updated.studentConfirmed && updated.instructorConfirmed) {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { status: LessonStatus.COMPLETED, escrowStatus: EscrowStatus.RELEASED },
    });

    await enqueueNotificationJob({
      type: "lesson.completed",
      idempotencyKey: `lesson.completed:${lessonId}`,
      payload: { lessonId, instructorId: lesson.instructorId },
    });
  }

  return ok(undefined);
}

// ─── Submit exam result (triggers Aprovômetro recalculation) ─────────────────

export async function submitExamResult(
  lessonId: string,
  result: "PASSED" | "FAILED",
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return err("Não autorizado");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { student: { select: { userId: true } } },
  });

  if (!lesson || lesson.status !== LessonStatus.COMPLETED) return err("Aula inválida");
  if (lesson.student.userId !== session.user.id) return err("Não autorizado");
  if (lesson.examResult) return err("Resultado já registrado");

  const { ExamResult } = await import("@prisma/client");

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { examResult: ExamResult[result] },
  });

  await enqueueNotificationJob({
    type: "aprovometro.recalculate",
    idempotencyKey: `aprovometro:${lesson.instructorId}:${lessonId}`,
    payload: { instructorId: lesson.instructorId },
  });

  return ok(undefined);
}

// ─── Cancel lesson ────────────────────────────────────────────────────────────

export async function cancelLesson(
  lessonId: string,
  reason: string,
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return err("Não autorizado");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      student: { select: { userId: true } },
      instructor: { select: { userId: true } },
    },
  });

  if (!lesson) return err("Aula não encontrada");
  if (lesson.status === LessonStatus.COMPLETED || lesson.status === LessonStatus.CANCELLED) {
    return err("Esta aula não pode ser cancelada");
  }

  const isStudent = lesson.student.userId === session.user.id;
  const isInstructor = lesson.instructor.userId === session.user.id;
  if (!isStudent && !isInstructor) return err("Não autorizado");

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      status: LessonStatus.CANCELLED,
      escrowStatus: EscrowStatus.REFUNDED,
      cancelledBy: session.user.id,
      cancelReason: reason,
      cancelledAt: new Date(),
    },
  });

  await enqueueNotificationJob({
    type: "lesson.cancelled",
    idempotencyKey: `lesson.cancelled:${lessonId}:${session.user.id}`,
    payload: { lessonId, cancelledBy: session.user.id, reason },
  });

  return ok(undefined);
}
