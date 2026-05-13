"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token },
  });

  function onSubmit(data: ResetPasswordInput) {
    setServerError("");
    startTransition(async () => {
      const result = await resetPassword(data);
      if (result.success) {
        router.push("/entrar?reset=1");
      } else {
        setServerError(result.error);
      }
    });
  }

  if (!token) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>Link inválido.</p>
        <Link href="/recuperar-senha" className="block mt-4 text-sm hover:underline" style={{ color: "var(--vl-accent)" }}>
          Solicitar novo link
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
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>Nova senha</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--vl-text-3)" }}>Escolha uma senha segura para sua conta.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <input type="hidden" {...register("token")} />

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            className="vl-input"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p id="confirm-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
            {serverError}{" "}
            {serverError.includes("expirado") && (
              <Link href="/recuperar-senha" className="underline">
                Solicitar novo link
              </Link>
            )}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Salvando…" : "Definir nova senha"}
        </Button>
      </form>
    </div>
  );
}
