"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import {
  createStripeConnectedAccount,
  createStripeOnboardingLink,
  refundPaymentIntent,
  transferToInstructor,
} from "@/lib/stripe";
import { EscrowStatus, LessonStatus } from "@prisma/client";

export async function startStripeOnboarding(): Promise<ActionResult<{ url: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { email: true } } },
  });
  if (!profile) return err("Perfil não encontrado");

  let stripeAccountId = profile.stripeAccountId;

  if (!stripeAccountId) {
    stripeAccountId = await createStripeConnectedAccount(
      profile.user.email!,
      profile.id,
    );
    await prisma.instructorProfile.update({
      where: { id: profile.id },
      data: { stripeAccountId },
    });
  }

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const url = await createStripeOnboardingLink(stripeAccountId, baseUrl);

  return ok({ url });
}

export async function completeStripeOnboarding(): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  await prisma.instructorProfile.update({
    where: { userId: session.user.id },
    data: { stripeOnboardingDone: true },
  });

  return ok(undefined);
}

export async function releaseEscrow(lessonId: string): Promise<ActionResult<void>> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      instructor: { select: { stripeAccountId: true } },
    },
  });

  if (!lesson || lesson.status !== LessonStatus.COMPLETED) return err("Aula inválida");
  if (lesson.escrowStatus === EscrowStatus.RELEASED) return ok(undefined);
  if (!lesson.instructor.stripeAccountId) return err("Instrutor sem conta Stripe");

  const platformFee = Math.round(Number(lesson.priceAmount) * 0.15 * 100);
  const instructorAmount = Math.round(Number(lesson.priceAmount) * 0.85 * 100);

  const transfer = await transferToInstructor({
    amountCents: instructorAmount,
    stripeAccountId: lesson.instructor.stripeAccountId,
    lessonId,
  });

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      escrowStatus: EscrowStatus.RELEASED,
      stripeTransferId: transfer.id,
    },
  });

  return ok(undefined);
}

export async function refundEscrow(lessonId: string): Promise<ActionResult<void>> {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });

  if (!lesson || !lesson.stripePaymentIntentId) return err("Aula inválida");
  if (lesson.escrowStatus === EscrowStatus.REFUNDED) return ok(undefined);

  await refundPaymentIntent(lesson.stripePaymentIntentId);

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { escrowStatus: EscrowStatus.REFUNDED },
  });

  return ok(undefined);
}
