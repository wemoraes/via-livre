import { History } from "lucide-react";

export default function StudentHistoricoPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
        Histórico
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--vl-text-3)" }}>
        Linha do tempo de aulas concluídas, com notas dadas e recebidas.
      </p>

      <div className="glass-card rounded-2xl p-10 text-center">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{ background: "rgba(13,18,16,0.06)", color: "var(--vl-text-3)" }}
        >
          <History size={22} />
        </span>
        <h2 className="text-base font-medium mb-2" style={{ color: "var(--vl-text-1)" }}>
          Em construção
        </h2>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--vl-text-3)" }}>
          Story 8.1d — Histórico com timeline, nota dada/recebida e prompt para avaliar aulas pendentes.
        </p>
      </div>
    </div>
  );
}
