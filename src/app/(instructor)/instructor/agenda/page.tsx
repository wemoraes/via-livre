"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAvailability } from "@/actions/lessons";

const DAYS = [
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

interface Slot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function AgendaPage() {
  const [slots, setSlots] = useState<Slot[]>([
    { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
    { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
    { dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
    { dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
    { dayOfWeek: 5, startTime: "08:00", endTime: "18:00" },
  ]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggleDay(day: number) {
    const exists = slots.some((s) => s.dayOfWeek === day);
    if (exists) {
      setSlots(slots.filter((s) => s.dayOfWeek !== day));
    } else {
      setSlots(
        [...slots, { dayOfWeek: day, startTime: "08:00", endTime: "18:00" }].sort(
          (a, b) => a.dayOfWeek - b.dayOfWeek,
        ),
      );
    }
  }

  function updateSlot(day: number, field: "startTime" | "endTime", value: string) {
    setSlots(slots.map((s) => (s.dayOfWeek === day ? { ...s, [field]: value } : s)));
  }

  function handleSave() {
    setError("");
    setSaved(false);
    for (const s of slots) {
      if (s.startTime >= s.endTime) {
        setError(`Horário inválido no dia ${DAYS.find((d) => d.value === s.dayOfWeek)?.label}.`);
        return;
      }
    }
    startTransition(async () => {
      const result = await saveAvailability(slots);
      if (result.success) setSaved(true);
      else setError(result.error);
    });
  }

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-xl mx-auto">
        <Link
          href="/instructor/onboarding"
          className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70"
          style={{ color: "var(--vl-text-3)" }}
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
            Minha agenda
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--vl-text-3)" }}>
            Configure os dias e horários em que você está disponível para dar aulas.
          </p>

          <div className="space-y-2">
            {DAYS.map(({ value, label }) => {
              const slot = slots.find((s) => s.dayOfWeek === value);
              const active = Boolean(slot);

              return (
                <div
                  key={value}
                  className="rounded-xl p-4 transition-all"
                  style={{
                    background: active ? "rgba(255,255,255,0.55)" : "rgba(13,18,16,0.03)",
                    border: `1px solid ${active ? "rgba(255,255,255,0.7)" : "rgba(13,18,16,0.06)"}`,
                    opacity: active ? 1 : 0.65,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`day-${value}`}
                      checked={active}
                      onChange={() => toggleDay(value)}
                      className="w-4 h-4"
                      style={{ accentColor: "var(--vl-accent)" }}
                    />
                    <label
                      htmlFor={`day-${value}`}
                      className="font-medium text-sm flex-1 cursor-pointer"
                      style={{ color: "var(--vl-text-1)" }}
                    >
                      {label}
                    </label>

                    {active && slot && (
                      <div className="flex items-center gap-2 text-sm">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(value, "startTime", e.target.value)}
                          className="vl-input py-1 px-2 w-auto text-xs"
                        />
                        <span style={{ color: "var(--vl-text-3)" }}>até</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(value, "endTime", e.target.value)}
                          className="vl-input py-1 px-2 w-auto text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mt-4">{error}</p>
          )}
          {saved && (
            <p role="status" className="text-sm rounded-lg px-3 py-2 mt-4" style={{ color: "var(--vl-accent)", background: "oklch(92% 0.07 145)" }}>
              Agenda salva com sucesso!
            </p>
          )}

          <Button onClick={handleSave} disabled={isPending} className="w-full mt-6">
            <Save size={15} className="mr-2" />
            {isPending ? "Salvando…" : "Salvar agenda"}
          </Button>
        </div>
      </div>
    </main>
  );
}
