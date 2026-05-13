import { prisma } from "@/lib/db";
import { LessonStatus, UserRole } from "@prisma/client";

export interface NextLessonData {
  id: string;
  instructorName: string;
  scheduledAt: Date;
  meetingPoint: string;
  vehicleLabel: string;
  priceAmount: number;
  instructorConfirmed: boolean;
  studentConfirmed: boolean;
}

export interface UpcomingLessonData {
  id: string;
  instructorName: string;
  scheduledAt: Date;
  status: LessonStatus;
}

export interface StudentDashboardData {
  firstName: string;
  nextLesson: NextLessonData | null;
  upcoming: UpcomingLessonData[];
  stats: {
    completedCount: number;
    upcomingCount: number;
    avgRatingReceived: number | null;
    ratingsCount: number;
  };
}

export async function getStudentDashboardData(userId: string): Promise<StudentDashboardData> {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { user: { select: { name: true } } },
  });
  if (!student) {
    throw new Error("Student profile not found");
  }

  const now = new Date();

  const [upcomingLessons, completedCount, upcomingCount, ratingsAgg] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        studentId: student.id,
        status: LessonStatus.CONFIRMED,
        scheduledAt: { gt: now },
      },
      orderBy: { scheduledAt: "asc" },
      take: 6,
      include: {
        instructor: { include: { user: { select: { name: true } } } },
        vehicle: { select: { brand: true, model: true } },
      },
    }),
    prisma.lesson.count({
      where: { studentId: student.id, status: LessonStatus.COMPLETED },
    }),
    prisma.lesson.count({
      where: {
        studentId: student.id,
        status: LessonStatus.CONFIRMED,
        scheduledAt: { gt: now },
      },
    }),
    prisma.rating.aggregate({
      where: { targetId: userId, role: UserRole.INSTRUCTOR },
      _avg: { score: true },
      _count: { score: true },
    }),
  ]);

  const [head, ...rest] = upcomingLessons;

  const nextLesson: NextLessonData | null = head
    ? {
        id: head.id,
        instructorName: head.instructor.user.name ?? "Instrutor",
        scheduledAt: head.scheduledAt,
        meetingPoint: head.meetingPoint,
        vehicleLabel: `${head.vehicle.brand} ${head.vehicle.model}`,
        priceAmount: Number(head.priceAmount),
        instructorConfirmed: head.instructorConfirmed,
        studentConfirmed: head.studentConfirmed,
      }
    : null;

  const upcoming: UpcomingLessonData[] = rest.slice(0, 5).map((l) => ({
    id: l.id,
    instructorName: l.instructor.user.name ?? "Instrutor",
    scheduledAt: l.scheduledAt,
    status: l.status,
  }));

  const firstName = (student.user.name ?? "Aluno").split(" ")[0];

  const avgRating = ratingsAgg._avg.score;
  const ratingsCount = ratingsAgg._count.score;

  return {
    firstName,
    nextLesson,
    upcoming,
    stats: {
      completedCount,
      upcomingCount,
      avgRatingReceived: avgRating !== null ? Math.round(avgRating * 10) / 10 : null,
      ratingsCount,
    },
  };
}
