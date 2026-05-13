"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { saveInstructorProfile } from "@/actions/instructor";
import { ProfileSchema, type ProfileInput } from "@/lib/validations/instructor";

type FormValues = z.input<typeof ProfileSchema>;

const STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function PerfilPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues, unknown, ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      pricePerLesson: 100,
      serviceRadius: 10,
      areas: [],
    },
  });

  function onSubmit(data: ProfileInput) {
    setServerError("");
    setSaved(false);
    startTransition(async () => {
      const result = await saveInstructorProfile(data);
      if (result.success) {
        setSaved(true);
        setTimeout(() => router.push("/instructor/onboarding"), 1000);
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <Link
          href="/instructor/onboarding"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={14} />
          Voltar ao onboarding
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Seu perfil</h1>
        <p className="text-sm text-gray-500 mb-8">
          Estas informações ficam visíveis para os alunos ao buscar instrutores.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Ex: Instrutor há 8 anos, especializado em direção urbana…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-red-600 text-xs mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="(11) 91234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="pricePerLesson" className="block text-sm font-medium text-gray-700 mb-1">
              Preço por aula (R$) <span className="text-red-500">*</span>
            </label>
            <input
              id="pricePerLesson"
              type="number"
              min={50}
              max={500}
              step={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
              {...register("pricePerLesson", { valueAsNumber: true })}
            />
            {errors.pricePerLesson && (
              <p className="text-red-600 text-xs mt-1">{errors.pricePerLesson.message}</p>
            )}
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                id="city"
                type="text"
                placeholder="São Paulo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
                {...register("state")}
              >
                <option value="">UF</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Service radius */}
          <div>
            <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700 mb-1">
              Raio de atendimento (km)
            </label>
            <input
              id="serviceRadius"
              type="number"
              min={2}
              max={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
              {...register("serviceRadius", { valueAsNumber: true })}
            />
            {errors.serviceRadius && (
              <p className="text-red-600 text-xs mt-1">{errors.serviceRadius.message}</p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          {saved && (
            <p role="status" className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2">
              Perfil salvo com sucesso!
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Salvando…" : "Salvar perfil"}
          </Button>
        </form>
      </div>
    </main>
  );
}
