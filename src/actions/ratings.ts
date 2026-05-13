"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { LessonStatus, UserRole } from "@prisma/client";
import { z } from "zod";

const RatingSchema = z.object({
  lessonId: z.string().cuid(),
  score: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function submitRating(
  input: z.infer<typeof RatingSchema>,
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return err("Não autorizado");

  const parsed = RatingSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { lessonId, score, comment } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      student: { include: { user: { select: { id: true } } } },
      instructor: { include: { user: { select: { id: true } } } },
    },
  });

  if (!lesson || lesson.status !== LessonStatus.COMPLETED) return err("Aula inválida");

  const isStudent = lesson.student.user.id === session.user.id;
  const isInstructor = lesson.instructor.user.id === session.user.id;
  if (!isStudent && !isInstructor) return err("Não autorizado");

  // Determine who is being rated
  const targetId = isStudent ? lesson.instructor.user.id : lesson.student.user.id;
  const role = isStudent ? UserRole.STUDENT : UserRole.INSTRUCTOR;

  const existing = await prisma.rating.findUnique({
    where: { lessonId_authorId: { lessonId, authorId: session.user.id } },
  });
  if (existing) return err("Você já avaliou esta aula");

  await prisma.rating.create({
    data: {
      lessonId,
      authorId: session.user.id,
      targetId,
      role,
      score,
      comment,
    },
  });

  // Update avgRating on InstructorProfile if student rated instructor
  if (isStudent) {
    const allRatings = await prisma.rating.findMany({
      where: { targetId, role: UserRole.STUDENT },
      select: { score: true },
    });
    const avg = allRatings.reduce((a, b) => a + b.score, 0) / allRatings.length;
    await prisma.instructorProfile.update({
      where: { userId: targetId },
      data: { avgRating: Math.round(avg * 10) / 10 },
    });
  }

  return ok(undefined);
}

export async function getInstructorRatings(
  instructorId: string,
): Promise<ActionResult<{ score: number; comment: string | null; authorName: string; createdAt: string }[]>> {
  const profile = await prisma.instructorProfile.findUnique({
    where: { id: instructorId },
    select: { userId: true },
  });
  if (!profile) return err("Instrutor não encontrado");

  const ratings = await prisma.rating.findMany({
    where: { targetId: profile.userId, role: UserRole.STUDENT },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return ok(
    ratings.map((r) => ({
      score: r.score,
      comment: r.comment,
      authorName: r.author.name ?? "Aluno",
      createdAt: r.createdAt.toISOString(),
    })),
  );
}
