"use client";

import { useState, useEffect, useTransition, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { getInstructorPublicProfile } from "@/actions/search";
import { getInstructorAvailability, getBookedSlots, bookLesson } from "@/actions/lessons";
import type { InstructorSearchResult } from "@/actions/search";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  params: Promise<{ instructorId: string }>;
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function generateSlots(startTime: string, endTime: string, durationMin = 60): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  let cur = startH * 60 + startM;
  const end = endH * 60 + endM;
  while (cur + durationMin <= end) {
    const h = String(Math.floor(cur / 60)).padStart(2, "0");
    const m = String(cur % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    cur += durationMin;
  }
  return slots;
}

function PaymentStep({ clientSecret, lessonId, price }: { clientSecret: string; lessonId: string; price: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    setError("");
    setIsPaying(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/aulas/${lessonId}?booked=1` },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Erro no pagamento.");
      setIsPaying(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 text-sm" style={{ background: "rgba(13,18,16,0.04)", color: "var(--vl-text-2)" }}>
        Total a pagar:{" "}
        <span className="font-bold" style={{ color: "var(--vl-text-1)" }}>R$ {price.toFixed(2)}</span>
      </div>

      <PaymentElement />

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <Button onClick={handlePay} disabled={isPaying || !stripe} className="w-full">
        {isPaying ? "Processando…" : `Pagar R$ ${price.toFixed(2)}`}
      </Button>
    </div>
  );
}

export default function AgendarPage({ params }: Props) {
  const { instructorId } = use(params);
  const router = useRouter();

  const [instructor, setInstructor] = useState<(InstructorSearchResult & { areas: string[] }) | null>(null);
  const [availability, setAvailability] = useState<{ dayOfWeek: number; startTime: string; endTime: string }[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ scheduledAt: string; durationMin: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [profileRes, availRes] = await Promise.all([
        getInstructorPublicProfile(instructorId),
        getInstructorAvailability(instructorId),
      ]);
      if (profileRes.success) setInstructor(profileRes.data);
      if (availRes.success) setAvailability(availRes.data);
    });
  }, [instructorId]);

  const loadBookedSlots = useCallback((date: Date) => {
    const from = new Date(date); from.setHours(0, 0, 0, 0);
    const to = new Date(date); to.setHours(23, 59, 59, 999);
    startTransition(async () => {
      const res = await getBookedSlots(instructorId, from, to);
      if (res.success) setBookedSlots(res.data);
    });
  }, [instructorId]);

  useEffect(() => {
    if (selectedDate) loadBookedSlots(selectedDate);
  }, [selectedDate, loadBookedSlots]);

  const availableDays = new Set(availability.map((a) => a.dayOfWeek));

  const dateOptions: Date[] = [];
  for (let i = 1; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    if (availableDays.has(d.getDay())) dateOptions.push(d);
  }

  const slotsForDate = selectedDate
    ? availability.filter((a) => a.dayOfWeek === selectedDate.getDay()).flatMap((a) => generateSlots(a.startTime, a.endTime))
    : [];

  const bookedTimes = new Set(
    bookedSlots.map((b) => {
      const d = new Date(b.scheduledAt);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }),
  );

  function handleConfirm() {
    if (!selectedDate || !selectedTime || !meetingPoint.trim() || !instructor) {
      setError("Preencha todos os campos.");
      return;
    }
    setError("");
    const scheduledAt = new Date(selectedDate);
    const [h, m] = selectedTime.split(":").map(Number);
    scheduledAt.setHours(h, m, 0, 0);

    startTransition(async () => {
      const result = await bookLesson({
        instructorId,
        scheduledAt: scheduledAt.toISOString(),
        durationMin: 60,
        meetingPoint: meetingPoint.trim(),
      });
      if (!result.success) { setError(result.error); return; }
      setLessonId(result.data.lessonId);
      setClientSecret(result.data.clientSecret);
    });
  }

  if (!instructor) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div aria-hidden className="vl-mesh" />
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--vl-accent) transparent var(--vl-accent) var(--vl-accent)" }}
        />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-xl mx-auto">
        <Link
          href={`/instrutores/${instructorId}`}
          className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70"
          style={{ color: "var(--vl-text-3)" }}
        >
          <ArrowLeft size={14} />
          Voltar ao perfil
        </Link>

        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
          Agendar aula
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--vl-text-3)" }}>
          com <span className="font-medium" style={{ color: "var(--vl-text-2)" }}>{instructor.name}</span>{" "}
          · R$ {instructor.pricePerLesson}/aula
        </p>

        {clientSecret && lessonId ? (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-5" style={{ color: "var(--vl-text-1)" }}>Pagamento</h2>
            <Elements stripe={stripePromise} options={{ clientSecret, locale: "pt-BR", appearance: { theme: "stripe" } }}>
              <PaymentStep clientSecret={clientSecret} lessonId={lessonId} price={instructor.pricePerLesson} />
            </Elements>
          </div>
        ) : (
          <>
            {/* Date picker */}
            <section className="mb-6">
              <h2 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: "var(--vl-text-2)" }}>
                <Calendar size={15} />
                Escolha a data
              </h2>
              {dateOptions.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>Instrutor sem horários configurados.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {dateOptions.slice(0, 14).map((d) => {
                    const isSelected = selectedDate?.toDateString() === d.toDateString();
                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        onClick={() => { setSelectedDate(d); setSelectedTime(""); }}
                        className="flex flex-col items-center px-3 py-2 rounded-xl border text-xs transition-all"
                        style={{
                          borderColor: isSelected ? "var(--vl-accent)" : "rgba(13,18,16,0.12)",
                          background: isSelected ? "var(--vl-accent)" : "rgba(255,255,255,0.55)",
                          color: isSelected ? "#fff" : "var(--vl-text-2)",
                        }}
                      >
                        <span className="font-medium">{DAY_NAMES[d.getDay()]}</span>
                        <span>{d.getDate()}/{d.getMonth() + 1}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Time slots */}
            {selectedDate && (
              <section className="mb-6">
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: "var(--vl-text-2)" }}>
                  <Clock size={15} />
                  Escolha o horário
                </h2>
                <div className="flex flex-wrap gap-2">
                  {slotsForDate.map((time) => {
                    const booked = bookedTimes.has(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTime(time)}
                        className="px-3 py-1.5 rounded-lg border text-sm transition-all"
                        style={{
                          borderColor: booked ? "rgba(13,18,16,0.06)" : isSelected ? "var(--vl-accent)" : "rgba(13,18,16,0.12)",
                          background: booked ? "rgba(13,18,16,0.03)" : isSelected ? "var(--vl-accent)" : "rgba(255,255,255,0.55)",
                          color: booked ? "var(--vl-text-3)" : isSelected ? "#fff" : "var(--vl-text-2)",
                          cursor: booked ? "not-allowed" : "pointer",
                          opacity: booked ? 0.5 : 1,
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Meeting point */}
            {selectedTime && (
              <section className="mb-6">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "var(--vl-text-2)" }}>
                  <MapPin size={15} />
                  Ponto de encontro
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rua das Flores, 123 — portão azul"
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="vl-input"
                />
              </section>
            )}

            {error && (
              <p role="alert" className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            {selectedTime && meetingPoint && (
              <Button type="button" disabled={isPending} className="w-full" onClick={handleConfirm}>
                {isPending ? "Aguarde…" : "Continuar para pagamento"}
              </Button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
