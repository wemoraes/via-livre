"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInstructorSchema, type RegisterInstructorInput } from "@/lib/validations/auth";
import { registerInstructor } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterInstructorPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInstructorInput>({ resolver: zodResolver(RegisterInstructorSchema) });

  function onSubmit(data: RegisterInstructorInput) {
    setServerError("");
    startTransition(async () => {
      const result = await registerInstructor(data);
      if (result.success) {
        setSuccess(true);
      } else {
        setServerError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Confirme seu email
        </h1>
        <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>
          Enviamos um link de confirmação. Após confirmar, você será redirecionado ao onboarding.
        </p>
        <Link href="/entrar" className="block mt-6 text-sm hover:underline" style={{ color: "var(--vl-accent)" }}>
          Já confirmei — fazer login
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
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>Criar conta — Instrutor</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--vl-text-3)" }}>
          Publique seu perfil e receba alunos diretamente
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            className="vl-input"
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            aria-describedby={errors.cpf ? "cpf-error" : undefined}
            className="vl-input"
            {...register("cpf")}
          />
          {errors.cpf && (
            <p id="cpf-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.cpf.message}
            </p>
          )}
        </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : "password-hint"}
              className="vl-input pr-10"
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <p id="password-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.password.message}
            </p>
          ) : (
            <p id="password-hint" className="text-xs mt-1" style={{ color: "var(--vl-text-3)" }}>
              Mínimo 8 caracteres
            </p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? "Criando conta…" : "Criar conta e começar onboarding"}
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: "var(--vl-text-3)" }}>
        Já tem conta?{" "}
        <Link href="/entrar" className="font-medium hover:underline" style={{ color: "var(--vl-accent)" }}>
          Entrar
        </Link>
      </p>

      <div className="border-t border-white/40 mt-6 pt-4 text-center">
        <p className="text-xs" style={{ color: "var(--vl-text-3)" }}>
          É aluno?{" "}
          <Link href="/cadastro/aluno" className="underline hover:opacity-70">
            Cadastre-se como aluno
          </Link>
        </p>
      </div>
    </div>
  );
}
