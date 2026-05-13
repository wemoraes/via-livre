import Link from "next/link";
import { History, Search } from "lucide-react";

export default function EmptyHistory() {
  return (
    <div className="glass-card rounded-2xl p-10 text-center">
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
        style={{ background: "rgba(13,18,16,0.06)", color: "var(--vl-text-3)" }}
      >
        <History size={22} />
      </span>
      <h2 className="text-base font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
        Você ainda não tem aulas no histórico
      </h2>
      <p className="text-sm max-w-sm mx-auto mb-5" style={{ color: "var(--vl-text-3)" }}>
        Após sua primeira aula concluída, ela aparece aqui com a nota dada e recebida.
      </p>
      <Link
        href="/instrutores"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
        style={{ background: "var(--vl-accent)", color: "#ffffff" }}
      >
        <Search size={14} />
        Agendar primeira aula
      </Link>
    </div>
  );
}
