"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterStudentSchema, type RegisterStudentInput } from "@/lib/validations/auth";
import { registerStudent } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterStudentPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStudentInput>({ resolver: zodResolver(RegisterStudentSchema) });

  function onSubmit(data: RegisterStudentInput) {
    setServerError("");
    startTransition(async () => {
      const result = await registerStudent(data);
      if (result.success) {
        setSuccess(true);
      } else {
        setServerError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Confirme seu email</h1>
        <p className="text-gray-500 text-sm">
          Enviamos um link de confirmação para o seu email. Verifique sua caixa de entrada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Criar conta — Aluno</h1>
        <p className="text-gray-500 mt-1 text-sm">Encontre instrutores credenciados perto de você</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : "password-hint"}
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
          {errors.password ? (
            <p id="password-error" role="alert" className="text-red-600 text-xs mt-1">
              {errors.password.message}
            </p>
          ) : (
            <p id="password-hint" className="text-gray-400 text-xs mt-1">
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
          {isPending ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-[oklch(55%_0.17_145)] font-medium hover:underline">
          Entrar
        </Link>
      </p>

      <div className="border-t border-gray-100 mt-6 pt-4 text-center">
        <p className="text-xs text-gray-400">
          É instrutor?{" "}
          <Link href="/cadastro/instrutor" className="underline hover:text-gray-600">
            Cadastre-se como instrutor
          </Link>
        </p>
      </div>
    </div>
  );
}
