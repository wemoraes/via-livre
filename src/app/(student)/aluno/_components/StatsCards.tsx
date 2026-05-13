import { CheckCircle2, Calendar, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  Icon: LucideIcon;
  tooltip?: string;
}

function StatCard({ label, value, sublabel, Icon, tooltip }: StatCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-5"
      title={tooltip}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <Icon size={16} />
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-2xl font-bold leading-none"
          style={{ color: "var(--vl-text-1)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {value}
        </span>
        {sublabel && (
          <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>{sublabel}</span>
        )}
      </div>
      <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--vl-text-3)" }}>{label}</p>
    </div>
  );
}

interface Props {
  stats: {
    completedCount: number;
    upcomingCount: number;
    avgRatingReceived: number | null;
    ratingsCount: number;
  };
}

export default function StatsCards({ stats }: Props) {
  const avg = stats.avgRatingReceived;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <StatCard
        label="Aulas concluídas"
        value={String(stats.completedCount)}
        Icon={CheckCircle2}
      />
      <StatCard
        label="Próximas aulas"
        value={String(stats.upcomingCount)}
        Icon={Calendar}
      />
      <StatCard
        label="Avaliação recebida"
        value={avg !== null ? avg.toFixed(1).replace(".", ",") : "—"}
        sublabel={avg !== null ? `(${stats.ratingsCount})` : "sem dados"}
        Icon={Star}
        tooltip="Média das notas que os instrutores te deram"
      />
    </div>
  );
}
