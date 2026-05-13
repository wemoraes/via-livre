"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { geocodeAddress } from "@/lib/maps";
import { enqueueNotificationJob } from "@/lib/qstash";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { ProfileSchema, VehicleSchema } from "@/lib/validations/instructor";
import type { ProfileInput, VehicleInput } from "@/lib/validations/instructor";
import { InstructorStatus } from "@prisma/client";

async function getInstructorProfile(userId: string) {
  return prisma.instructorProfile.findUnique({ where: { userId } });
}

// ─── Save Profile ─────────────────────────────────────────────────────────────

export async function saveInstructorProfile(
  input: ProfileInput,
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const parsed = ProfileSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { bio, phone, pricePerLesson, serviceRadius, city, state, areas } = parsed.data;

  // Geocode city+state for lat/lng if provided
  let lat = parsed.data.lat;
  let lng = parsed.data.lng;
  if (city && state && !lat) {
    const coords = await geocodeAddress(`${city}, ${state}, Brasil`);
    if (coords) { lat = coords.lat; lng = coords.lng; }
  }

  await prisma.instructorProfile.update({
    where: { userId: session.user.id },
    data: { bio, phone, pricePerLesson, serviceRadius, city, state, areas, lat, lng },
  });

  return ok(undefined);
}

// ─── Save Vehicle ─────────────────────────────────────────────────────────────

export async function saveVehicle(
  input: VehicleInput & { photoKey?: string; crlvKey?: string; vehicleId?: string },
): Promise<ActionResult<{ vehicleId: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const parsed = VehicleSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const profile = await getInstructorProfile(session.user.id);
  if (!profile) return err("Perfil não encontrado");

  const plate = parsed.data.plate.toUpperCase().replace("-", "");

  // If marking as primary, unset others first
  if (parsed.data.isPrimary) {
    await prisma.vehicle.updateMany({
      where: { instructorId: profile.id },
      data: { isPrimary: false },
    });
  }

  let vehicle;
  if (input.vehicleId) {
    vehicle = await prisma.vehicle.update({
      where: { id: input.vehicleId, instructorId: profile.id },
      data: { ...parsed.data, plate, photoKey: input.photoKey, crlvKey: input.crlvKey },
    });
  } else {
    vehicle = await prisma.vehicle.create({
      data: {
        ...parsed.data,
        plate,
        instructorId: profile.id,
        photoKey: input.photoKey,
        crlvKey: input.crlvKey,
      },
    });
  }

  return ok({ vehicleId: vehicle.id });
}

// ─── Get Onboarding Status ────────────────────────────────────────────────────

export async function getOnboardingStatus(): Promise<
  ActionResult<{
    documents: { type: string; status: string; reviewNote: string | null }[];
    approvedCount: number;
    profileComplete: boolean;
    hasVehicle: boolean;
    stripeOnboardingDone: boolean;
    hasAvailability: boolean;
    submittedAt: Date | null;
  }>
> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      documents: { select: { type: true, status: true, reviewNote: true, updatedAt: true } },
      vehicles: { where: { active: true }, select: { id: true } },
      availability: { where: { active: true }, select: { id: true } },
    },
  });

  if (!profile) return err("Perfil não encontrado");

  const REQUIRED_DOCS = ["CNH_EAR", "SENATRAN_CREDENTIAL", "CRIMINAL_CERTIFICATE", "TAX_CERTIFICATE", "CRLV"];
  const docMap = Object.fromEntries(profile.documents.map((d) => [d.type, d]));

  const documents = REQUIRED_DOCS.map((type) => ({
    type,
    status: docMap[type]?.status ?? "PENDING",
    reviewNote: docMap[type]?.reviewNote ?? null,
  }));

  const approvedCount = documents.filter((d) => d.status === "APPROVED").length;
  const profileComplete = Boolean(profile.bio && Number(profile.pricePerLesson) > 0 && profile.city);
  const hasVehicle = profile.vehicles.length > 0;
  const hasAvailability = profile.availability.length > 0;

  // Earliest submission time (first doc that left PENDING state)
  const submittedDocs = profile.documents.filter((d) => d.status !== "PENDING");
  const submittedAt = submittedDocs.length > 0
    ? submittedDocs.reduce((min, d) => d.updatedAt < min ? d.updatedAt : min, submittedDocs[0].updatedAt)
    : null;

  return ok({
    documents,
    approvedCount,
    profileComplete,
    hasVehicle,
    stripeOnboardingDone: profile.stripeOnboardingDone,
    hasAvailability,
    submittedAt,
  });
}

// ─── Story 3.5: Check & suspend expired documents (called by QStash daily job) ─

export async function processDocumentExpiryAlerts(): Promise<void> {
  const now = new Date();
  const thresholds = [90, 60, 30].map((days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return { days, date: d };
  });

  for (const { days, date } of thresholds) {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);

    const expiring = await prisma.document.findMany({
      where: { expiresAt: { gte: start, lte: end }, status: "APPROVED" },
      include: { instructor: { include: { user: { select: { email: true, name: true } } } } },
    });

    for (const doc of expiring) {
      await enqueueNotificationJob({
        type: "document.expiring",
        payload: {
          instructorId: doc.instructorId,
          email: doc.instructor.user.email,
          name: doc.instructor.user.name,
          documentType: doc.type,
          expiresAt: doc.expiresAt,
          daysLeft: days,
        },
        idempotencyKey: `expiry:${doc.id}:${days}d`,
      });
    }
  }

  // Suspend instructors with expired documents
  const expired = await prisma.document.findMany({
    where: { expiresAt: { lt: now }, status: "APPROVED" },
    include: { instructor: { select: { id: true, status: true, user: { select: { email: true, name: true } } } } },
  });

  for (const doc of expired) {
    await prisma.document.update({ where: { id: doc.id }, data: { status: "EXPIRED" } });

    if (doc.instructor.status === InstructorStatus.ACTIVE) {
      await prisma.instructorProfile.update({
        where: { id: doc.instructorId },
        data: { status: InstructorStatus.SUSPENDED },
      });

      await enqueueNotificationJob({
        type: "document.reviewed",
        payload: {
          instructorId: doc.instructorId,
          email: doc.instructor.user.email,
          suspended: true,
          reason: `Documento ${doc.type} vencido`,
        },
        idempotencyKey: `suspend:${doc.instructorId}:${doc.id}`,
      });
    }
  }
}
