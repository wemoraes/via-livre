"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, MapPin, Car, ChevronRight, Clock } from "lucide-react";
import { LessonStatus } from "@prisma/client";
import { formatLessonDateTime } from "@/lib/datetime";
import { LESSON_STATUS_LABEL, LESSON_STATUS_STYLE } from "@/lib/status-colors";
import type { WeekLesson } from "../_data/week";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  lesson: WeekLesson;
  onClose: () => void;
}

export default function LessonDetailPanel({ lesson, onClose }: Props) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const pendingExpiresIn = (() => {
    if (lesson.status !== LessonStatus.PENDING) return null;
    const expireAt = new Date(lesson.createdAt.getTime() + 2 * 3600 * 1000);
    const ms = expireAt.getTime() - Date.now();
    if (ms <= 0) return "Expirado";
    const minutes = Math.floor(ms / 60_000);
    if (minutes < 60) return `Expira em ${minutes} min`;
    const hours = Math.floor(ms / 3_600_000);
    return `Expira em ${hours}h`;
  })();

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ background: "rgba(13,18,16,0.20)" }}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Detalhes da aula"
        className="fixed z-50 inset-x-0 bottom-0 md:bottom-auto md:right-6 md:top-20 md:inset-x-auto md:w-96 rounded-t-2xl md:rounded-2xl overflow-auto max-h-[85vh]"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 18px 50px rgba(13,18,16,0.18)",
        }}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-tight" style={{ color: "var(--vl-text-1)" }}>
                {lesson.studentName}
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--vl-text-2)" }}>
                {formatLessonDateTime(lesson.scheduledAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black/[0.04]"
              style={{ color: "var(--vl-text-3)" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                color: LESSON_STATUS_STYLE[lesson.status].color,
                background: LESSON_STATUS_STYLE[lesson.status].bg,
              }}
            >
              {LESSON_STATUS_LABEL[lesson.status]}
            </span>
            {pendingExpiresIn && (
              <span
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "oklch(96% 0.04 85)", color: "oklch(55% 0.12 85)" }}
              >
                <Clock size={11} />
                {pendingExpiresIn}
              </span>
            )}
          </div>

          <ul className="space-y-2.5 mb-5 text-sm">
            <li className="flex items-start gap-2" style={{ color: "var(--vl-text-2)" }}>
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
              <span>{lesson.meetingPoint}</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: "var(--vl-text-2)" }}>
              <Car size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
              <span>{lesson.vehicleLabel}</span>
            </li>
            <li className="flex flex-col gap-0.5" style={{ color: "var(--vl-text-2)" }}>
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontWeight: 600 }}>
                {brl.format(lesson.netAmount)} líquido
              </span>
              <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>
                Bruto {brl.format(lesson.grossAmount)} · taxa ViaLivre 15%
              </span>
            </li>
          </ul>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/instructor/aulas/${lesson.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--vl-accent)", color: "#ffffff" }}
            >
              Ver detalhes
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
