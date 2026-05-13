"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(ForgotPasswordSchema) });

  function onSubmit(data: ForgotPasswordInput) {
    startTransition(async () => {
      await forgotPassword(data);
      setSent(true); // always show success — never reveal email existence
    });
  }

  if (sent) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Verifique seu email
        </h1>
        <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>
          Se o email existir, você receberá as instruções de recuperação em breve.
        </p>
        <Link href="/entrar" className="block mt-6 text-sm hover:underline" style={{ color: "var(--vl-accent)" }}>
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="mb-2 text-center">
        <span className="text-xl font-black tracking-tight" style={{ color: "var(--vl-text-1)" }}>
          Via<span style={{ color: "var(--vl-accent)" }}>.</span>Livre
        </span>
      </div>
      <div className="mb-8 mt-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>Recuperar senha</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--vl-text-3)" }}>
          Informe seu email e enviaremos um link para criar nova senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            className="vl-input"
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Enviando…" : "Enviar link de recuperação"}
        </Button>
      </form>

      <p className="text-center mt-6">
        <Link href="/entrar" className="text-sm hover:underline" style={{ color: "var(--vl-text-3)" }}>
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
