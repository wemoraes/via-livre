import Link from "next/link";
import { Calendar, Search } from "lucide-react";

export default function StudentHomePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
          Início
        </h1>
        <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>
          Seu painel de controle. Em breve aqui: próxima aula, progresso, recomendações.
        </p>
      </header>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
          >
            <Calendar size={26} />
          </span>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
            Bem-vindo ao ViaLivre
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--vl-text-3)" }}>
            Este painel ainda está sendo construído. Por enquanto, você pode buscar instrutores e ver
            suas aulas pelos links na navegação.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/instrutores"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--vl-accent)", color: "#fff" }}
            >
              <Search size={15} />
              Buscar instrutores
            </Link>
            <Link
              href="/aulas"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-white/50"
              style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
            >
              <Calendar size={15} />
              Ver minhas aulas
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: "var(--vl-text-3)" }}>
        Stories 8.1b–e em andamento: cards de progresso, próxima aula em destaque, histórico completo, perfil editável.
      </p>
    </div>
  );
}
