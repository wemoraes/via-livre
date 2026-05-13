"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { StatusFilter } from "../_data/history";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "COMPLETED", label: "Concluídas" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "DISPUTED", label: "Disputas" },
];

export default function HistoryFilters() {
  const searchParams = useSearchParams();
  const active = (searchParams.get("status") ?? "ALL") as StatusFilter;

  return (
    <nav
      className="flex flex-wrap gap-2 mb-4"
      aria-label="Filtros de histórico"
    >
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        const href = f.value === "ALL" ? "/aluno/historico" : `/aluno/historico?status=${f.value}`;
        return (
          <Link
            key={f.value}
            href={href}
            scroll={false}
            className="text-sm px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: isActive ? "var(--vl-accent)" : "rgba(255,255,255,0.55)",
              color: isActive ? "#ffffff" : "var(--vl-text-2)",
              border: isActive ? "1px solid var(--vl-accent)" : "1px solid rgba(13,18,16,0.12)",
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {f.label}
          </Link>
        );
      })}
    </nav>
  );
}
