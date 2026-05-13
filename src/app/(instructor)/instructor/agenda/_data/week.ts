import { prisma } from "@/lib/db";
import { LessonStatus } from "@prisma/client";
import { addDays, startOfWeek } from "@/lib/week";

export interface WeekLesson {
  id: string;
  status: LessonStatus;
  scheduledAt: Date;
  durationMin: number;
  studentName: string;
  meetingPoint: string;
  vehicleLabel: string;
  netAmount: number;
  grossAmount: number;
  studentConfirmed: boolean;
  instructorConfirmed: boolean;
  createdAt: Date;
}

export interface WeekAvailabilitySlot {
  dayOfWeek: number; // 0–6 (dom–sáb)
  startTime: string; // "08:00"
  endTime: string;
}

export interface InstructorWeekData {
  weekStart: Date;
  lessons: WeekLesson[];
  availability: WeekAvailabilitySlot[];
}

const INSTRUCTOR_SHARE = 0.85;

export async function getInstructorWeekData(
  userId: string,
  weekStart: Date,
): Promise<InstructorWeekData> {
  const profile = await prisma.instructorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    return { weekStart: startOfWeek(weekStart), lessons: [], availability: [] };
  }

  const start = startOfWeek(weekStart);
  const end = addDays(start, 7);

  const [lessons, availability] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        instructorId: profile.id,
        scheduledAt: { gte: start, lt: end },
        status: { in: [LessonStatus.PENDING, LessonStatus.CONFIRMED, LessonStatus.COMPLETED, LessonStatus.CANCELLED, LessonStatus.DISPUTED] },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        student: { include: { user: { select: { name: true } } } },
        vehicle: { select: { brand: true, model: true } },
      },
    }),
    prisma.availability.findMany({
      where: { instructorId: profile.id, active: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
  ]);

  const weekLessons: WeekLesson[] = lessons.map((l) => ({
    id: l.id,
    status: l.status,
    scheduledAt: l.scheduledAt,
    durationMin: l.durationMin,
    studentName: l.student.user.name ?? "Aluno",
    meetingPoint: l.meetingPoint,
    vehicleLabel: `${l.vehicle.brand} ${l.vehicle.model}`,
    grossAmount: Number(l.priceAmount),
    netAmount: Number(l.priceAmount) * INSTRUCTOR_SHARE,
    studentConfirmed: l.studentConfirmed,
    instructorConfirmed: l.instructorConfirmed,
    createdAt: l.createdAt,
  }));

  const slots: WeekAvailabilitySlot[] = availability.map((a) => ({
    dayOfWeek: a.dayOfWeek,
    startTime: a.startTime,
    endTime: a.endTime,
  }));

  return { weekStart: start, lessons: weekLessons, availability: slots };
}
