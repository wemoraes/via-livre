import Link from "next/link";
import { MapPin, Car, CheckCircle2, ChevronRight } from "lucide-react";
import { formatLessonDateTime, formatCountdown } from "@/lib/datetime";
import type { NextInstructorLessonData } from "../_data/dashboard";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function NextLessonCard({ lesson }: { lesson: NextInstructorLessonData }) {
  const countdown = formatCountdown(lesson.scheduledAt);
  const dateLabel = formatLessonDateTime(lesson.scheduledAt);

  return (
    <section className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--vl-accent)" }}>
            Sua próxima aula
          </p>
          <h2 className="text-xl font-semibold leading-tight" style={{ color: "var(--vl-text-1)" }}>
            {lesson.studentName}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--vl-text-2)" }}>{dateLabel}</p>
        </div>
        <span
          className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: "oklch(55% 0.17 145)",
            color: "#ffffff",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {countdown}
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <li className="flex items-start gap-2 text-sm" style={{ color: "var(--vl-text-2)" }}>
          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
          <span className="truncate">{lesson.meetingPoint}</span>
        </li>
        <li className="flex items-start gap-2 text-sm" style={{ color: "var(--vl-text-2)" }}>
          <Car size={14} className="mt-0.5 shrink-0" style={{ color: "var(--vl-text-3)" }} />
          <span className="truncate">{lesson.vehicleLabel}</span>
        </li>
        <li className="flex flex-col gap-0.5 text-sm" style={{ color: "var(--vl-text-2)" }}>
          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontWeight: 600 }}>
            {brl.format(lesson.netAmount)}
          </span>
          <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>
            líquido · bruto {brl.format(lesson.grossAmount)}
          </span>
        </li>
      </ul>

      {lesson.studentConfirmed && (
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium mb-4"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <CheckCircle2 size={12} />
          Aluno confirmou
        </div>
      )}

      <Link
        href={`/aulas/${lesson.id}`}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
        style={{ background: "var(--vl-accent)", color: "#ffffff" }}
      >
        Ver detalhes
        <ChevronRight size={14} />
      </Link>
    </section>
  );
}
