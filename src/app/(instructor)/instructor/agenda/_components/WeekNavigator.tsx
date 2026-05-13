import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, toIsoDate, formatWeekRangeShort } from "@/lib/week";

interface Props {
  weekStart: Date;
  todayWeekStart: Date;
}

export default function WeekNavigator({ weekStart, todayWeekStart }: Props) {
  const prev = toIsoDate(addWeeks(weekStart, -1));
  const next = toIsoDate(addWeeks(weekStart, 1));
  const isCurrentWeek = weekStart.getTime() === todayWeekStart.getTime();

  return (
    <nav
      aria-label="Navegação de semana"
      className="flex items-center justify-between gap-3 mb-4"
    >
      <h2 className="text-lg font-semibold" style={{ color: "var(--vl-text-1)" }}>
        {formatWeekRangeShort(weekStart)}
      </h2>
      <div className="flex items-center gap-1">
        {!isCurrentWeek && (
          <Link
            href="/instructor/agenda"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/50"
            style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
          >
            Hoje
          </Link>
        )}
        <Link
          href={`/instructor/agenda?week=${prev}`}
          aria-label="Semana anterior"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-white/50"
          style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
        >
          <ChevronLeft size={16} />
        </Link>
        <Link
          href={`/instructor/agenda?week=${next}`}
          aria-label="Próxima semana"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-white/50"
          style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </nav>
  );
}
