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
      setSlots([...slots, { dayOfWeek: day, startTime: "08:00", endTime: "18:00" }].sort(
        (a, b) => a.dayOfWeek - b.dayOfWeek,
      ));
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <Link
          href="/instructor/onboarding"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Minha agenda</h1>
        <p className="text-sm text-gray-500 mb-8">
          Configure os dias e horários em que você está disponível para dar aulas.
        </p>

        <div className="space-y-3">
          {DAYS.map(({ value, label }) => {
            const slot = slots.find((s) => s.dayOfWeek === value);
            const active = Boolean(slot);

            return (
              <div
                key={value}
                className={`bg-white border rounded-2xl p-4 transition-colors ${
                  active ? "border-gray-200" : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${value}`}
                    checked={active}
                    onChange={() => toggleDay(value)}
                    className="w-4 h-4 accent-[oklch(55%_0.17_145)]"
                  />
                  <label htmlFor={`day-${value}`} className="font-medium text-sm text-gray-900 flex-1 cursor-pointer">
                    {label}
                  </label>

                  {active && slot && (
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateSlot(value, "startTime", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
                      />
                      <span className="text-gray-400">até</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateSlot(value, "endTime", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2 mt-4">
            Agenda salva!
          </p>
        )}

        <Button onClick={handleSave} disabled={isPending} className="w-full mt-6">
          <Save size={15} className="mr-2" />
          {isPending ? "Salvando…" : "Salvar agenda"}
        </Button>
      </div>
    </main>
  );
}
