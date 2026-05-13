"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { DocumentStatus, InstructorStatus, AuditAction } from "@prisma/client";
import { enqueueNotificationJob } from "@/lib/qstash";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Não autorizado");
  return session.user;
}

// ─── Document review ──────────────────────────────────────────────────────────

export async function reviewDocument(
  documentId: string,
  action: "APPROVED" | "REJECTED",
  reviewNote?: string,
): Promise<ActionResult<void>> {
  let admin;
  try { admin = await requireAdmin(); } catch { return err("Não autorizado"); }

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      instructor: {
        include: { user: { select: { email: true, name: true } } },
      },
    },
  });
  if (!doc) return err("Documento não encontrado");

  const newStatus = action === "APPROVED" ? DocumentStatus.APPROVED : DocumentStatus.REJECTED;

  await prisma.$transaction([
    prisma.document.update({
      where: { id: documentId },
      data: { status: newStatus, reviewNote: reviewNote ?? null },
    }),
    prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: action === "APPROVED" ? AuditAction.DOCUMENT_APPROVED : AuditAction.DOCUMENT_REJECTED,
        targetType: "Document",
        targetId: documentId,
        note: reviewNote,
      },
    }),
  ]);

  await enqueueNotificationJob({
    type: "document.reviewed",
    idempotencyKey: `doc.reviewed:${documentId}:${action}`,
    payload: {
      email: doc.instructor.user.email,
      name: doc.instructor.user.name,
      documentType: doc.type,
      approved: action === "APPROVED",
      reason: reviewNote,
    },
  });

  // Check if all docs approved → activate instructor
  if (action === "APPROVED") {
    const allDocs = await prisma.document.findMany({
      where: { instructorId: doc.instructorId },
      select: { status: true },
    });
    const allApproved = allDocs.every((d) => d.status === DocumentStatus.APPROVED);

    if (allApproved && allDocs.length >= 5) {
      await prisma.instructorProfile.update({
        where: { id: doc.instructorId },
        data: { status: InstructorStatus.ACTIVE },
      });
    }
  }

  return ok(undefined);
}

// ─── Get pending documents ────────────────────────────────────────────────────

export async function getPendingDocuments(): Promise<
  ActionResult<
    {
      id: string;
      type: string;
      status: string;
      storageKey: string | null;
      instructorName: string;
      instructorId: string;
      submittedAt: string;
    }[]
  >
> {
  try { await requireAdmin(); } catch { return err("Não autorizado"); }

  const docs = await prisma.document.findMany({
    where: { status: { in: [DocumentStatus.SUBMITTED, DocumentStatus.UNDER_REVIEW] } },
    include: {
      instructor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "asc" },
  });

  return ok(
    docs.map((d) => ({
      id: d.id,
      type: d.type,
      status: d.status,
      storageKey: d.storageKey,
      instructorName: d.instructor.user.name ?? "Instrutor",
      instructorId: d.instructorId,
      submittedAt: d.updatedAt.toISOString(),
    })),
  );
}

// ─── Suspend / reactivate instructor ─────────────────────────────────────────

export async function updateInstructorStatus(
  instructorId: string,
  action: "SUSPEND" | "ACTIVATE",
  note?: string,
): Promise<ActionResult<void>> {
  let admin;
  try { admin = await requireAdmin(); } catch { return err("Não autorizado"); }

  const newStatus = action === "SUSPEND" ? InstructorStatus.SUSPENDED : InstructorStatus.ACTIVE;

  await prisma.$transaction([
    prisma.instructorProfile.update({
      where: { id: instructorId },
      data: { status: newStatus },
    }),
    prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: AuditAction.INSTRUCTOR_SUSPENDED,
        targetType: "InstructorProfile",
        targetId: instructorId,
        note,
      },
    }),
  ]);

  return ok(undefined);
}

// ─── List instructors with status ────────────────────────────────────────────

export async function listInstructors(
  status?: InstructorStatus,
): Promise<
  ActionResult<
    {
      id: string;
      name: string;
      city: string | null;
      state: string | null;
      status: string;
      aprovometro: number | null;
      avgRating: number | null;
      createdAt: string;
    }[]
  >
> {
  try { await requireAdmin(); } catch { return err("Não autorizado"); }

  const profiles = await prisma.instructorProfile.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return ok(
    profiles.map((p) => ({
      id: p.id,
      name: p.user.name ?? "Instrutor",
      city: p.city,
      state: p.state,
      status: p.status,
      aprovometro: p.aprovometro,
      avgRating: p.avgRating,
      createdAt: p.createdAt.toISOString(),
    })),
  );
}
