"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";

const CreateBlockSchema = z
  .object({
    startsAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
    endsAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
    reason: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .refine((d) => new Date(d.endsAt).getTime() > new Date(d.startsAt).getTime(), {
    message: "Horário final precisa ser depois do inicial",
    path: ["endsAt"],
  });

export type CreateTimeBlockInput = z.infer<typeof CreateBlockSchema>;

export async function createTimeBlock(
  input: CreateTimeBlockInput,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const parsed = CreateBlockSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Dados inválidos");

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return err("Perfil de instrutor não encontrado");

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);

  try {
    const block = await prisma.timeBlock.create({
      data: {
        instructorId: profile.id,
        startsAt,
        endsAt,
        reason: parsed.data.reason || null,
      },
      select: { id: true },
    });
    return ok(block);
  } catch (e) {
    console.error("[availability] createTimeBlock", e);
    return err("Erro ao criar bloqueio");
  }
}

export async function removeTimeBlock(blockId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INSTRUCTOR") return err("Não autorizado");

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return err("Perfil de instrutor não encontrado");

  const block = await prisma.timeBlock.findUnique({
    where: { id: blockId },
    select: { instructorId: true },
  });
  if (!block) return err("Bloqueio não encontrado");
  if (block.instructorId !== profile.id) return err("Não autorizado");

  try {
    await prisma.timeBlock.delete({ where: { id: blockId } });
    return ok(undefined);
  } catch (e) {
    console.error("[availability] removeTimeBlock", e);
    return err("Erro ao remover bloqueio");
  }
}
