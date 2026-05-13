import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import type { NotificationJob } from "@/lib/qstash";
import {
  sendLessonBookedEmail,
  sendLessonCancelledEmail,
  sendDocumentReviewedEmail,
  sendDocumentExpiringEmail,
} from "@/lib/email";
import { recalculateAprovometro } from "@/lib/aprovometro";
import { prisma } from "@/lib/db";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("upstash-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const isValid = await receiver.verify({ signature: sig, body }).catch(() => false);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const job: NotificationJob = JSON.parse(body);

  try {
    await processJob(job);
  } catch (e) {
    console.error("[qstash] job processing error", job.type, e);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ processed: true });
}

async function processJob(job: NotificationJob) {
  const p = job.payload;

  switch (job.type) {
    case "lesson.booked":
    case "lesson.confirmed": {
      const lesson = await prisma.lesson.findUnique({
        where: { id: p.lessonId as string },
        include: {
          student: { include: { user: { select: { email: true, name: true } } } },
          instructor: { include: { user: { select: { name: true } } } },
        },
      });
      if (!lesson) break;
      await sendLessonBookedEmail({
        to: lesson.student.user.email!,
        name: lesson.student.user.name ?? "Aluno",
        instructorName: lesson.instructor.user.name ?? undefined,
        scheduledAt: lesson.scheduledAt.toISOString(),
        meetingPoint: lesson.meetingPoint,
        priceAmount: Number(lesson.priceAmount),
        lessonId: lesson.id,
      });
      break;
    }

    case "lesson.cancelled": {
      const lesson = await prisma.lesson.findUnique({
        where: { id: p.lessonId as string },
        include: {
          student: { include: { user: { select: { email: true, name: true } } } },
        },
      });
      if (!lesson) break;
      await sendLessonCancelledEmail({
        to: lesson.student.user.email!,
        name: lesson.student.user.name ?? "Aluno",
        lessonId: lesson.id,
        reason: p.reason as string | undefined,
      });
      break;
    }

    case "lesson.completed":
      // Escrow release handled via confirmLessonCompletion action
      break;

    case "document.submitted":
      break;

    case "document.reviewed": {
      const approved = !p.suspended;
      await sendDocumentReviewedEmail({
        to: p.email as string,
        name: p.name as string,
        documentType: p.documentType as string ?? "Documento",
        approved: approved as boolean,
        reason: p.reason as string | undefined,
      });
      break;
    }

    case "document.expiring": {
      await sendDocumentExpiringEmail({
        to: p.email as string,
        name: p.name as string,
        documentType: p.documentType as string,
        daysLeft: p.daysLeft as number,
        expiresAt: p.expiresAt as string | undefined,
      });
      break;
    }

    case "aprovometro.recalculate":
      if (p.instructorId) {
        await recalculateAprovometro(p.instructorId as string);
      }
      break;
  }
}
