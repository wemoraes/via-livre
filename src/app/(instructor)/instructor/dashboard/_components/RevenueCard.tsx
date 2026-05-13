import { Wallet } from "lucide-react";

interface Props {
  monthRevenue: number;
  completedThisMonth: number;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function RevenueCard({ monthRevenue, completedThisMonth }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <Wallet size={16} />
        </span>
      </div>
      <p
        className="text-2xl font-bold leading-none"
        style={{ color: "var(--vl-text-1)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        {brl.format(monthRevenue)}
      </p>
      <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--vl-text-3)" }}>
        Receita do mês
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
        {completedThisMonth} aula{completedThisMonth !== 1 ? "s" : ""} concluída{completedThisMonth !== 1 ? "s" : ""} · taxa ViaLivre 15%
      </p>
    </div>
  );
}
