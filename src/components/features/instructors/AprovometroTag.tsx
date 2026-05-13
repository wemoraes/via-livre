import { TrendingUp } from "lucide-react";

interface Props {
  aprovometro: number | null;
  aprovometroCount: number;
  size?: "sm" | "md";
}

export default function AprovometroTag({ aprovometro, aprovometroCount, size = "md" }: Props) {
  if (!aprovometro || aprovometroCount < 5) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
          size === "sm" ? "text-xs" : "text-sm"
        }`}
        style={{
          background: "rgba(13,18,16,0.06)",
          color: "var(--vl-text-3)",
        }}
      >
        <TrendingUp size={size === "sm" ? 12 : 14} />
        Novo Instrutor
      </span>
    );
  }

  const value = Math.round(aprovometro * 10) / 10;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
      style={{
        background: "oklch(55% 0.17 145)",
        color: "#ffffff",
      }}
      title={`Média de ${value} aulas até a aprovação (${aprovometroCount} alunos)`}
    >
      <TrendingUp size={size === "sm" ? 12 : 14} />
      <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{value}</span>
      <span style={{ opacity: 0.85 }}>aulas/aprovação</span>
    </span>
  );
}
