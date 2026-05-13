"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getSignedUploadUrl, getSignedReadUrl } from "@/lib/storage";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { DocumentType, DocumentStatus } from "@prisma/client";
import { z } from "zod";

const UploadUrlSchema = z.object({
  documentType: z.nativeEnum(DocumentType),
  ext: z.enum(["pdf", "jpg", "jpeg", "png"]),
});

export async function getSignedDocumentUploadUrl(
  input: z.infer<typeof UploadUrlSchema>,
): Promise<ActionResult<{ signedUrl: string; path: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") {
    return err("Não autorizado");
  }

  const parsed = UploadUrlSchema.safeParse(input);
  if (!parsed.success) return err("Dados inválidos");

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return err("Perfil de instrutor não encontrado");

  try {
    const result = await getSignedUploadUrl(profile.id, parsed.data.documentType, parsed.data.ext);
    return ok(result);
  } catch (e) {
    console.error("[storage] getSignedDocumentUploadUrl", e);
    return err("Erro ao gerar URL de upload");
  }
}

export async function saveDocumentMetadata(input: {
  documentType: DocumentType;
  storagePath: string;
  expiresAt?: string;
}): Promise<ActionResult<{ documentId: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") {
    return err("Não autorizado");
  }

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return err("Perfil de instrutor não encontrado");

  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : undefined;

  const document = await prisma.document.upsert({
    where: { instructorId_type: { instructorId: profile.id, type: input.documentType } },
    create: {
      instructorId: profile.id,
      type: input.documentType,
      status: DocumentStatus.SUBMITTED,
      storageKey: input.storagePath,
      expiresAt,
    },
    update: {
      storageKey: input.storagePath,
      status: DocumentStatus.SUBMITTED,
      reviewNote: null,
      expiresAt,
    },
  });

  return ok({ documentId: document.id });
}

export async function getDocumentSignedReadUrl(
  documentId: string,
): Promise<ActionResult<{ url: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return err("Não autorizado");
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { storageKey: true },
  });
  if (!document?.storageKey) return err("Documento não encontrado");

  try {
    const url = await getSignedReadUrl(document.storageKey, 900);
    return ok({ url });
  } catch (e) {
    console.error("[storage] getDocumentSignedReadUrl", e);
    return err("Erro ao gerar URL de leitura");
  }
}
