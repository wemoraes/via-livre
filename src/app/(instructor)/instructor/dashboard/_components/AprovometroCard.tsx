import { TrendingUp } from "lucide-react";

interface Props {
  aprovometro: number | null;
  aprovometroCount: number;
}

export default function AprovometroCard({ aprovometro, aprovometroCount }: Props) {
  const isNew = aprovometro === null || aprovometroCount < 5;
  const value = aprovometro !== null ? Math.round(aprovometro * 10) / 10 : null;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: isNew ? "rgba(13,18,16,0.06)" : "oklch(55% 0.17 145)",
            color: isNew ? "var(--vl-text-3)" : "#ffffff",
          }}
        >
          <TrendingUp size={16} />
        </span>
      </div>
      {isNew ? (
        <>
          <p className="text-base font-semibold leading-tight" style={{ color: "var(--vl-text-1)" }}>
            Novo Instrutor
          </p>
          <p className="text-xs mt-1.5" style={{ color: "var(--vl-text-3)" }}>
            Aprovômetro precisa de 5+ alunos com exame registrado.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-2xl font-bold leading-none"
              style={{ color: "var(--vl-text-1)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {value!.toFixed(1).replace(".", ",")}
            </span>
            <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>aulas/aprovação</span>
          </div>
          <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--vl-text-3)" }}>
            Aprovômetro
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
            Baseado em {aprovometroCount} aluno{aprovometroCount !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </div>
  );
}
