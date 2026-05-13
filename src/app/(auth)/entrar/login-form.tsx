"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginWithCredentials } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const resetSuccess = searchParams.get("reset") === "1";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  function onSubmit(data: LoginInput) {
    setServerError("");
    startTransition(async () => {
      const result = await loginWithCredentials(data.email, data.password, callbackUrl);
      if (!result.success) setServerError(result.error);
    });
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="mb-2 text-center">
        <span className="text-xl font-black tracking-tight" style={{ color: "var(--vl-text-1)" }}>
          Via<span style={{ color: "var(--vl-accent)" }}>.</span>Livre
        </span>
      </div>
      <div className="mb-8 mt-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>Entrar</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--vl-text-3)" }}>Bem-vindo de volta ao ViaLivre</p>
      </div>

      {resetSuccess && (
        <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2 mb-4">
          Senha redefinida com sucesso. Faça login.
        </p>
      )}

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
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
          {errors.password && (
            <p id="password-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <div className="flex justify-end">
          <Link href="/recuperar-senha" className="text-sm hover:underline" style={{ color: "var(--vl-text-3)" }}>
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: "var(--vl-text-3)" }}>
        Não tem conta?{" "}
        <Link href="/cadastro/aluno" className="font-medium hover:underline" style={{ color: "var(--vl-accent)" }}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
