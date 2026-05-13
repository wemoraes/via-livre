import { prisma } from "@/lib/db";
import { LessonStatus, DocumentStatus, type DocumentType, type InstructorStatus } from "@prisma/client";

const VIALIVRE_FEE = 0.15;
const INSTRUCTOR_SHARE = 1 - VIALIVRE_FEE; // 0.85
const EXPIRY_ALERT_WINDOW_DAYS = 90;

export interface NextInstructorLessonData {
  id: string;
  studentName: string;
  scheduledAt: Date;
  meetingPoint: string;
  vehicleLabel: string;
  netAmount: number; // priceAmount * 0.85
  grossAmount: number;
  studentConfirmed: boolean;
  instructorConfirmed: boolean;
}

export interface UpcomingInstructorLesson {
  id: string;
  studentName: string;
  scheduledAt: Date;
  status: LessonStatus;
}

export interface PendingRequestItem {
  id: string;
  studentName: string;
  scheduledAt: Date;
  netAmount: number;
}

export interface ExpiringDocumentItem {
  id: string;
  type: DocumentType;
  expiresAt: Date;
  daysUntilExpiry: number;
}

export interface InstructorDashboardData {
  firstName: string;
  status: InstructorStatus;
  nextLesson: NextInstructorLessonData | null;
  upcoming: UpcomingInstructorLesson[];
  stats: {
    monthRevenue: number;
    upcomingCount: number;
    completedThisMonth: number;
    aprovometro: number | null;
    aprovometroCount: number;
    avgRating: number | null;
    ratingsCount: number;
  };
  pendingRequests: PendingRequestItem[];
  expiringDocuments: ExpiringDocumentItem[];
}

export async function getInstructorDashboardData(userId: string): Promise<InstructorDashboardData> {
  const profile = await prisma.instructorProfile.findUnique({
    where: { userId },
    include: { user: { select: { name: true } } },
  });
  if (!profile) throw new Error("Instructor profile not found");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [upcomingLessons, monthCompletedAgg, completedThisMonthCount, upcomingCount, ratingsAgg, pendingLessons, expiringDocs] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        instructorId: profile.id,
        status: LessonStatus.CONFIRMED,
        scheduledAt: { gt: now },
      },
      orderBy: { scheduledAt: "asc" },
      take: 6,
      include: {
        student: { include: { user: { select: { name: true } } } },
        vehicle: { select: { brand: true, model: true } },
      },
    }),
    prisma.lesson.aggregate({
      where: {
        instructorId: profile.id,
        status: LessonStatus.COMPLETED,
        scheduledAt: { gte: monthStart },
      },
      _sum: { priceAmount: true },
    }),
    prisma.lesson.count({
      where: {
        instructorId: profile.id,
        status: LessonStatus.COMPLETED,
        scheduledAt: { gte: monthStart },
      },
    }),
    prisma.lesson.count({
      where: { instructorId: profile.id, status: LessonStatus.CONFIRMED, scheduledAt: { gt: now } },
    }),
    prisma.rating.aggregate({
      where: { targetId: userId, role: "STUDENT" },
      _avg: { score: true },
      _count: { score: true },
    }),
    prisma.lesson.findMany({
      where: {
        instructorId: profile.id,
        status: LessonStatus.PENDING,
        instructorConfirmed: false,
      },
      orderBy: { scheduledAt: "asc" },
      take: 5,
      include: { student: { include: { user: { select: { name: true } } } } },
    }),
    prisma.document.findMany({
      where: {
        instructorId: profile.id,
        status: DocumentStatus.APPROVED,
        expiresAt: {
          gte: now,
          lte: new Date(now.getTime() + EXPIRY_ALERT_WINDOW_DAYS * 86_400_000),
        },
      },
      orderBy: { expiresAt: "asc" },
      take: 5,
    }),
  ]);

  const [head, ...rest] = upcomingLessons;

  const nextLesson: NextInstructorLessonData | null = head
    ? {
        id: head.id,
        studentName: head.student.user.name ?? "Aluno",
        scheduledAt: head.scheduledAt,
        meetingPoint: head.meetingPoint,
        vehicleLabel: `${head.vehicle.brand} ${head.vehicle.model}`,
        netAmount: Number(head.priceAmount) * INSTRUCTOR_SHARE,
        grossAmount: Number(head.priceAmount),
        studentConfirmed: head.studentConfirmed,
        instructorConfirmed: head.instructorConfirmed,
      }
    : null;

  const upcoming: UpcomingInstructorLesson[] = rest.slice(0, 5).map((l) => ({
    id: l.id,
    studentName: l.student.user.name ?? "Aluno",
    scheduledAt: l.scheduledAt,
    status: l.status,
  }));

  const pendingRequests: PendingRequestItem[] = pendingLessons.map((l) => ({
    id: l.id,
    studentName: l.student.user.name ?? "Aluno",
    scheduledAt: l.scheduledAt,
    netAmount: Number(l.priceAmount) * INSTRUCTOR_SHARE,
  }));

  const expiringDocuments: ExpiringDocumentItem[] = expiringDocs.map((d) => ({
    id: d.id,
    type: d.type,
    expiresAt: d.expiresAt!,
    daysUntilExpiry: Math.max(0, Math.ceil((d.expiresAt!.getTime() - now.getTime()) / 86_400_000)),
  }));

  const grossMonth = Number(monthCompletedAgg._sum.priceAmount ?? 0);
  const monthRevenue = grossMonth * INSTRUCTOR_SHARE;

  const avgRating = ratingsAgg._avg.score;
  const ratingsCount = ratingsAgg._count.score;

  const firstName = (profile.user.name ?? "Instrutor").split(" ")[0];

  return {
    firstName,
    status: profile.status,
    nextLesson,
    upcoming,
    stats: {
      monthRevenue,
      upcomingCount,
      completedThisMonth: completedThisMonthCount,
      aprovometro: profile.aprovometro,
      aprovometroCount: profile.aprovometroCount,
      avgRating: avgRating !== null ? Math.round(avgRating * 10) / 10 : null,
      ratingsCount,
    },
    pendingRequests,
    expiringDocuments,
  };
}
