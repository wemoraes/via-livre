import { TrendingUp } from "lucide-react";

interface Props {
  aprovometro: number | null;
  aprovometroCount: number;
  size?: "sm" | "md";
}

export default function AprovometroTag({ aprovometro, aprovometroCount, size = "md" }: Props) {
  if (!aprovometro || aprovometroCount < 5) {
    return (
      <span className={`inline-flex items-center gap-1 text-gray-400 ${size === "sm" ? "text-xs" : "text-sm"}`}>
        <TrendingUp size={size === "sm" ? 12 : 14} />
        Novo instrutor
      </span>
    );
  }

  const value = Math.round(aprovometro * 10) / 10;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full px-2 py-0.5 ${
        size === "sm" ? "text-xs" : "text-sm"
      } ${
        value <= 10
          ? "text-green-700 bg-green-50"
          : value <= 15
          ? "text-yellow-700 bg-yellow-50"
          : "text-orange-700 bg-orange-50"
      }`}
      title={`Média de ${value} aulas até a aprovação (${aprovometroCount} alunos)`}
    >
      <TrendingUp size={size === "sm" ? 12 : 14} />
      {value} aulas/aprovação
    </span>
  );
}
