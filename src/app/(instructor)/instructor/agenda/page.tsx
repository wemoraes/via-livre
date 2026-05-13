import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { auth } from "@/auth";
import { getInstructorWeekData } from "./_data/week";
import WeeklyGrid from "./_components/WeeklyGrid";
import WeekNavigator from "./_components/WeekNavigator";
import { parseIsoDate, startOfWeek } from "@/lib/week";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function InstructorAgendaPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const { week } = await searchParams;
  const parsed = week ? parseIsoDate(week) : null;
  const today = new Date();
  const weekStart = parsed ? startOfWeek(parsed) : startOfWeek(today);
  const todayWeekStart = startOfWeek(today);

  const data = await getInstructorWeekData(session.user.id, weekStart);

  return (
    <div className="max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>
            Agenda
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--vl-text-3)" }}>
            Suas aulas da semana em uma vista única.
          </p>
        </div>
        <Link
          href="/instructor/disponibilidade"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-white/50"
          style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
        >
          <CalendarClock size={14} />
          Configurar disponibilidade
        </Link>
      </header>

      <WeekNavigator weekStart={data.weekStart} todayWeekStart={todayWeekStart} />

      {data.lessons.length === 0 && (
        <div
          className="glass-card rounded-2xl p-4 mb-3 text-center text-sm"
          style={{ color: "var(--vl-text-3)" }}
        >
          Nenhuma aula nesta semana. Slots em verde mostram seus horários disponíveis.
        </div>
      )}

      <WeeklyGrid
        weekStart={data.weekStart}
        todayWeekStart={todayWeekStart}
        lessons={data.lessons}
        availability={data.availability}
        timeBlocks={data.timeBlocks}
      />

      <p className="text-xs text-center mt-4" style={{ color: "var(--vl-text-3)" }}>
        Clique em qualquer slot vazio para bloquear o horário.
      </p>
    </div>
  );
}
