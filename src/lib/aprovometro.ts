import { prisma } from "@/lib/db";
import { ExamResult, LessonStatus } from "@prisma/client";

export async function recalculateAprovometro(instructorId: string): Promise<void> {
  // Fetch all completed lessons for this instructor where exam result was set
  const lessons = await prisma.lesson.findMany({
    where: {
      instructorId,
      status: LessonStatus.COMPLETED,
      examResult: { not: null },
    },
    select: {
      studentId: true,
      examResult: true,
    },
    orderBy: { scheduledAt: "asc" },
  });

  if (lessons.length === 0) return;

  // Group by studentId to find lessons-until-approval for each student
  const byStudent = new Map<string, { results: ExamResult[]; passedIdx: number | null }>();

  for (const lesson of lessons) {
    if (!lesson.examResult) continue;
    const existing = byStudent.get(lesson.studentId) ?? { results: [], passedIdx: null };
    existing.results.push(lesson.examResult);
    if (lesson.examResult === ExamResult.PASSED && existing.passedIdx === null) {
      existing.passedIdx = existing.results.length;
    }
    byStudent.set(lesson.studentId, existing);
  }

  // Only count students who eventually passed
  const samples: number[] = [];
  for (const { passedIdx } of byStudent.values()) {
    if (passedIdx !== null) samples.push(passedIdx);
  }

  if (samples.length < 5) {
    // Not enough data — keep null to show "Novo Instrutor"
    await prisma.instructorProfile.update({
      where: { id: instructorId },
      data: { aprovometro: null, aprovometroCount: samples.length },
    });
    return;
  }

  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;

  await prisma.instructorProfile.update({
    where: { id: instructorId },
    data: {
      aprovometro: Math.round(avg * 10) / 10,
      aprovometroCount: samples.length,
    },
  });
}
