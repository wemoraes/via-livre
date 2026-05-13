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

const inputCls = "vl-input";
const labelCls = "block text-sm font-medium mb-1";

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
    <div className="max-w-xl">
        <Link
          href="/instructor/onboarding"
          className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70"
          style={{ color: "var(--vl-text-3)" }}
        >
          <ArrowLeft size={14} />
          Voltar ao onboarding
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
            Seu perfil
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--vl-text-3)" }}>
            Estas informações ficam visíveis para os alunos ao buscar instrutores.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="bio" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                Bio <span style={{ color: "var(--vl-text-3)" }} className="font-normal">(opcional)</span>
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Ex: Instrutor há 8 anos, especializado em direção urbana…"
                className="vl-input resize-none"
                {...register("bio")}
              />
              {errors.bio && <p className="text-red-600 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                WhatsApp <span style={{ color: "var(--vl-text-3)" }} className="font-normal">(opcional)</span>
              </label>
              <input id="phone" type="tel" placeholder="(11) 91234-5678" className={inputCls} {...register("phone")} />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="pricePerLesson" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                Preço por aula (R$) <span className="text-red-500">*</span>
              </label>
              <input
                id="pricePerLesson"
                type="number"
                min={50}
                max={500}
                step={5}
                className={inputCls}
                {...register("pricePerLesson", { valueAsNumber: true })}
              />
              {errors.pricePerLesson && <p className="text-red-600 text-xs mt-1">{errors.pricePerLesson.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className={labelCls} style={{ color: "var(--vl-text-2)" }}>Cidade</label>
                <input id="city" type="text" placeholder="São Paulo" className={inputCls} {...register("city")} />
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="state" className={labelCls} style={{ color: "var(--vl-text-2)" }}>Estado</label>
                <select id="state" className={`${inputCls} bg-white/60`} {...register("state")}>
                  <option value="">UF</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="serviceRadius" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                Raio de atendimento (km)
              </label>
              <input
                id="serviceRadius"
                type="number"
                min={2}
                max={50}
                className={inputCls}
                {...register("serviceRadius", { valueAsNumber: true })}
              />
              {errors.serviceRadius && <p className="text-red-600 text-xs mt-1">{errors.serviceRadius.message}</p>}
            </div>

            {serverError && (
              <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{serverError}</p>
            )}
            {saved && (
              <p role="status" className="text-sm rounded-lg px-3 py-2" style={{ color: "var(--vl-accent)", background: "oklch(92% 0.07 145)" }}>
                Perfil salvo com sucesso!
              </p>
            )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Salvando…" : "Salvar perfil"}
          </Button>
        </form>
      </div>
    </div>
  );
}
