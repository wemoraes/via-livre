import Link from "next/link";
import { Search, Shield } from "lucide-react";

export default function EmptyHero() {
  return (
    <section className="glass-card rounded-2xl p-8 mb-6">
      <div className="flex flex-col items-start max-w-xl">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <Search size={22} />
        </span>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Sua jornada começa aqui
        </h2>
        <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--vl-text-2)" }}>
          Encontre um instrutor credenciado e agende sua primeira aula. Pagamento em escrow — só
          liberamos o valor para o instrutor depois que a aula é confirmada por você.
        </p>
        <Link
          href="/instrutores"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 mb-4"
          style={{ background: "var(--vl-accent)", color: "#ffffff" }}
        >
          <Search size={15} />
          Buscar instrutores
        </Link>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--vl-text-3)" }}>
          <Shield size={12} />
          Todos os instrutores são verificados pelo DETRAN e SENATRAN.
        </div>
      </div>
    </section>
  );
}
