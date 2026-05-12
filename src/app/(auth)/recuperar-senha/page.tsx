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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Verifique seu email</h1>
        <p className="text-gray-500 text-sm">
          Se o email existir, você receberá as instruções de recuperação em breve.
        </p>
        <Link href="/entrar" className="block mt-6 text-sm text-[oklch(55%_0.17_145)] hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Recuperar senha</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Informe seu email e enviaremos um link para criar nova senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
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
        <Link href="/entrar" className="text-sm text-gray-500 hover:text-gray-700">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
