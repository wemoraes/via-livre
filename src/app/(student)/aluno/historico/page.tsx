import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getStudentHistoryData } from "./_data/history";
import type { StatusFilter } from "./_data/history";
import RatingPrompt from "./_components/RatingPrompt";
import LessonTimeline from "./_components/LessonTimeline";
import HistoryFilters from "./_components/HistoryFilters";
import EmptyHistory from "./_components/EmptyHistory";

const VALID_STATUSES = new Set(["ALL", "COMPLETED", "CANCELLED", "DISPUTED"]);

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function StudentHistoricoPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const { status } = await searchParams;
  const filter: StatusFilter = (status && VALID_STATUSES.has(status) ? status : "ALL") as StatusFilter;

  const data = await getStudentHistoryData(session.user.id, filter);

  const hasAny = data.total > 0 || filter !== "ALL";

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--vl-text-1)" }}>
          Histórico
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--vl-text-3)" }}>
          {data.total > 0
            ? `${data.total} aula${data.total !== 1 ? "s" : ""} no histórico.`
            : "Suas aulas passadas vão aparecer aqui."}
        </p>
      </header>

      <RatingPrompt count={data.pendingRatingsCount} />

      {hasAny && (
        <Suspense>
          <HistoryFilters />
        </Suspense>
      )}

      {data.items.length === 0 ? (
        filter !== "ALL" ? (
          <div className="glass-card rounded-2xl p-8 text-center text-sm" style={{ color: "var(--vl-text-3)" }}>
            Nenhuma aula com este filtro.
          </div>
        ) : (
          <EmptyHistory />
        )
      ) : (
        <LessonTimeline items={data.items} />
      )}
    </div>
  );
}
