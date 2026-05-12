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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500 text-sm">Link inválido.</p>
        <Link href="/recuperar-senha" className="block mt-4 text-sm text-[oklch(55%_0.17_145)] hover:underline">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Nova senha</h1>
        <p className="text-gray-500 mt-1 text-sm">Escolha uma senha segura para sua conta.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <input type="hidden" {...register("token")} />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
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
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
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
