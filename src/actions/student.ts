"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getSignedAvatarUploadUrl, getAvatarReadUrl } from "@/lib/storage";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";

const ProfileSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d{10,15}$/.test(v.replace(/\D/g, "")), "Telefone inválido"),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[A-Z]{2}$/.test(v), "UF deve ter 2 letras"),
});

export type StudentProfileInput = z.infer<typeof ProfileSchema>;

export async function updateStudentProfile(
  input: StudentProfileInput,
): Promise<ActionResult<{ updatedAt: Date }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return err("Não autorizado");

  const parsed = ProfileSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dados inválidos";
    return err(firstError);
  }

  const data = parsed.data;
  const phoneNormalized = data.phone ? data.phone.replace(/\D/g, "") : null;

  const userId = session.user.id;

  try {
    const [, profile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name: data.name },
      }),
      prisma.studentProfile.upsert({
        where: { userId },
        create: {
          userId,
          phone: phoneNormalized,
          city: data.city || null,
          state: data.state || null,
        },
        update: {
          phone: phoneNormalized,
          city: data.city || null,
          state: data.state || null,
        },
      }),
    ]);

    return ok({ updatedAt: profile.updatedAt });
  } catch (e) {
    console.error("[student] updateStudentProfile", e);
    return err("Erro ao salvar perfil");
  }
}

const AvatarUploadSchema = z.object({
  ext: z.enum(["jpg", "jpeg", "png", "webp"]),
});

export async function getSignedStudentAvatarUploadUrl(
  input: z.infer<typeof AvatarUploadSchema>,
): Promise<ActionResult<{ signedUrl: string; path: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return err("Não autorizado");

  const parsed = AvatarUploadSchema.safeParse(input);
  if (!parsed.success) return err("Formato inválido");

  try {
    const result = await getSignedAvatarUploadUrl(session.user.id, parsed.data.ext);
    return ok(result);
  } catch (e) {
    console.error("[student] getSignedStudentAvatarUploadUrl", e);
    return err("Erro ao gerar URL de upload");
  }
}

export async function persistStudentAvatar(
  storagePath: string,
): Promise<ActionResult<{ avatarUrl: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") return err("Não autorizado");

  if (!storagePath.startsWith(`avatars/${session.user.id}/`)) {
    return err("Caminho de arquivo inválido");
  }

  try {
    const avatarUrl = await getAvatarReadUrl(storagePath);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: avatarUrl },
    });
    return ok({ avatarUrl });
  } catch (e) {
    console.error("[student] persistStudentAvatar", e);
    return err("Erro ao salvar avatar");
  }
}
