"use server";

import { hash, randomBytes } from "crypto";
import { hash as bcryptHash } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/email";
import { checkRateLimit } from "@/lib/redis";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import {
  RegisterStudentSchema,
  RegisterInstructorSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/validations/auth";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

// ─── Register Student ─────────────────────────────────────────────────────────

export async function registerStudent(
  input: z.infer<typeof RegisterStudentSchema>,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = RegisterStudentSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return err("Este email já está cadastrado");

  const passwordHash = await bcryptHash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: UserRole.STUDENT,
      studentProfile: { create: {} },
    },
  });

  await sendVerificationEmail(user.id, email, name ?? "");

  return ok({ userId: user.id });
}

// ─── Register Instructor ──────────────────────────────────────────────────────

export async function registerInstructor(
  input: z.infer<typeof RegisterInstructorSchema>,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = RegisterInstructorSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return err("Este email já está cadastrado");

  const passwordHash = await bcryptHash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: UserRole.INSTRUCTOR,
      instructorProfile: {
        create: { pricePerLesson: 0 },
      },
    },
  });

  await resend.emails.send({
    from: "ViaLivre <noreply@viaLivre.com.br>",
    to: email,
    subject: "Bem-vindo ao ViaLivre! Próximos passos",
    html: `<p>Olá ${name},</p><p>Sua conta foi criada. Complete seu perfil de instrutor para começar a receber alunos.</p>`,
  });

  return ok({ userId: user.id });
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginWithCredentials(
  email: string,
  password: string,
  callbackUrl?: string,
): Promise<ActionResult<void>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  const { allowed } = await checkRateLimit(`login:${ip}`, 5, 900);
  if (!allowed) return err("Muitas tentativas. Tente novamente em 15 minutos.");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? "/",
    });
    return ok(undefined);
  } catch (e) {
    const message = String(e);
    if (message.includes("CredentialsSignin") || message.includes("NEXT_REDIRECT")) {
      if (message.includes("NEXT_REDIRECT")) throw e; // let Next.js handle redirect
      return err("Email ou senha incorretos");
    }
    throw e;
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut({ redirectTo: "/" });
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(
  input: z.infer<typeof ForgotPasswordSchema>,
): Promise<ActionResult<void>> {
  const parsed = ForgotPasswordSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Always return success — don't reveal email existence
  if (!user) return ok(undefined);

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: `reset:${user.email}`,
      token: hash("sha256", token),
      expires,
    },
  });

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  await resend.emails.send({
    from: "ViaLivre <noreply@viaLivre.com.br>",
    to: user.email,
    subject: "Recuperação de senha — ViaLivre",
    html: `<p>Clique no link para redefinir sua senha (válido por 1 hora):</p><p><a href="${baseUrl}/nova-senha?token=${token}">Redefinir senha</a></p>`,
  });

  return ok(undefined);
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(
  input: z.infer<typeof ResetPasswordSchema>,
): Promise<ActionResult<void>> {
  const parsed = ResetPasswordSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { token, password } = parsed.data;
  const tokenHash = hash("sha256", token);

  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!record || record.expires < new Date()) {
    return err("Link expirado ou inválido. Solicite um novo.");
  }

  const email = record.identifier.replace("reset:", "");
  const passwordHash = await bcryptHash(password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { password: passwordHash } }),
    prisma.verificationToken.delete({ where: { token: tokenHash } }),
  ]);

  return ok(undefined);
}

// ─── Email Verification ───────────────────────────────────────────────────────

async function sendVerificationEmail(userId: string, email: string, name: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.verificationToken.create({
    data: {
      identifier: `verify:${email}`,
      token: hash("sha256", token),
      expires,
    },
  });

  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  await resend.emails.send({
    from: "ViaLivre <noreply@viaLivre.com.br>",
    to: email,
    subject: "Confirme seu email — ViaLivre",
    html: `<p>Olá ${name},</p><p><a href="${baseUrl}/verificar-email?token=${token}">Confirmar email</a></p>`,
  });

  void userId;
}
