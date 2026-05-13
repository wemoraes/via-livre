"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { saveVehicle } from "@/actions/instructor";
import { VehicleSchema, type VehicleInput } from "@/lib/validations/instructor";
import { VehicleCategory } from "@prisma/client";

type FormValues = z.input<typeof VehicleSchema>;

const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  AUTO: "Automóvel",
  MOTO: "Motocicleta",
};

const inputCls = "vl-input";
const labelCls = "block text-sm font-medium mb-1";

export default function VeiculoPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues, unknown, VehicleInput>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      category: VehicleCategory.AUTO,
      isPrimary: true,
    },
  });

  function onSubmit(data: VehicleInput) {
    setServerError("");
    startTransition(async () => {
      const result = await saveVehicle(data);
      if (result.success) router.push("/instructor/onboarding");
      else setServerError(result.error);
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
            Veículo de aula
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--vl-text-3)" }}>
            Cadastre o carro ou moto que você usa nas aulas.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="plate" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                Placa <span className="text-red-500">*</span>
              </label>
              <input
                id="plate"
                type="text"
                placeholder="AAA-0000 ou AAA-0A00"
                className={`${inputCls} uppercase`}
                {...register("plate")}
              />
              {errors.plate && <p className="text-red-600 text-xs mt-1">{errors.plate.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                  Marca <span className="text-red-500">*</span>
                </label>
                <input id="brand" type="text" placeholder="Volkswagen" className={inputCls} {...register("brand")} />
                {errors.brand && <p className="text-red-600 text-xs mt-1">{errors.brand.message}</p>}
              </div>
              <div>
                <label htmlFor="model" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input id="model" type="text" placeholder="Gol" className={inputCls} {...register("model")} />
                {errors.model && <p className="text-red-600 text-xs mt-1">{errors.model.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                  Ano <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  min={2000}
                  max={new Date().getFullYear() + 1}
                  placeholder="2020"
                  className={inputCls}
                  {...register("year", { valueAsNumber: true })}
                />
                {errors.year && <p className="text-red-600 text-xs mt-1">{errors.year.message}</p>}
              </div>
              <div>
                <label htmlFor="color" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                  Cor <span className="text-red-500">*</span>
                </label>
                <input id="color" type="text" placeholder="Prata" className={inputCls} {...register("color")} />
                {errors.color && <p className="text-red-600 text-xs mt-1">{errors.color.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="category" className={labelCls} style={{ color: "var(--vl-text-2)" }}>
                Categoria <span className="text-red-500">*</span>
              </label>
              <select id="category" className={`${inputCls} bg-white/60`} {...register("category")}>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {serverError && (
              <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{serverError}</p>
            )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Salvando…" : "Salvar veículo"}
          </Button>
        </form>
      </div>
    </div>
  );
}
