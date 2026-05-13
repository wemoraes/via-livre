import { prisma } from "@/lib/db";
import { LessonStatus, UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export type StatusFilter = "ALL" | "COMPLETED" | "CANCELLED" | "DISPUTED";

export interface HistoryLessonItem {
  id: string;
  scheduledAt: Date;
  status: LessonStatus;
  instructorName: string;
  meetingPoint: string;
  /** rating tied to this lesson (max 1 — schema constraint). null if not yet rated. */
  rating: {
    score: number;
    role: UserRole; // STUDENT = "Você avaliou"; INSTRUCTOR = "Você foi avaliado"
    isOwnAuthor: boolean; // true if the current student authored this rating
  } | null;
}

export interface StudentHistoryData {
  items: HistoryLessonItem[];
  pendingRatingsCount: number;
  total: number;
}

const STATUS_FILTER_TO_WHERE: Record<StatusFilter, Prisma.LessonWhereInput> = {
  ALL: {
    OR: [
      { status: { in: [LessonStatus.COMPLETED, LessonStatus.CANCELLED, LessonStatus.DISPUTED] } },
      { AND: [{ status: LessonStatus.CONFIRMED }, { scheduledAt: { lt: new Date() } }] },
    ],
  },
  COMPLETED: { status: LessonStatus.COMPLETED },
  CANCELLED: { status: LessonStatus.CANCELLED },
  DISPUTED: { status: LessonStatus.DISPUTED },
};

export async function getStudentHistoryData(
  userId: string,
  filter: StatusFilter = "ALL",
): Promise<StudentHistoryData> {
  const student = await prisma.studentProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!student) return { items: [], pendingRatingsCount: 0, total: 0 };

  const where = {
    studentId: student.id,
    ...STATUS_FILTER_TO_WHERE[filter],
  } satisfies Prisma.LessonWhereInput;

  const [lessons, total, pendingRatingsCount] = await Promise.all([
    prisma.lesson.findMany({
      where,
      include: {
        instructor: { include: { user: { select: { name: true } } } },
        rating: { select: { score: true, role: true, authorId: true } },
      },
      orderBy: { scheduledAt: "desc" },
      take: 30,
    }),
    prisma.lesson.count({ where }),
    prisma.lesson.count({
      where: {
        studentId: student.id,
        status: LessonStatus.COMPLETED,
        rating: null,
      },
    }),
  ]);

  const items: HistoryLessonItem[] = lessons.map((l) => ({
    id: l.id,
    scheduledAt: l.scheduledAt,
    status: l.status,
    instructorName: l.instructor.user.name ?? "Instrutor",
    meetingPoint: l.meetingPoint,
    rating: l.rating
      ? {
          score: l.rating.score,
          role: l.rating.role,
          isOwnAuthor: l.rating.authorId === userId,
        }
      : null,
  }));

  return { items, pendingRatingsCount, total };
}
