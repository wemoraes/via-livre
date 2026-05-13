import Link from "next/link";
import { Sparkles, User, Camera } from "lucide-react";

export default function EmptyInstructorHero() {
  return (
    <section className="glass-card rounded-2xl p-8 mb-6">
      <div className="flex flex-col items-start max-w-xl">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <Sparkles size={22} />
        </span>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Pronto para receber o primeiro aluno?
        </h2>
        <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--vl-text-2)" }}>
          Sua agenda está vazia. Algumas coisas que ajudam alunos a te escolherem:
        </p>
        <ul className="space-y-2 mb-5 text-sm" style={{ color: "var(--vl-text-2)" }}>
          <li className="flex items-center gap-2">
            <Camera size={14} style={{ color: "var(--vl-text-3)" }} />
            Foto de perfil profissional aumenta a confiança
          </li>
          <li className="flex items-center gap-2">
            <User size={14} style={{ color: "var(--vl-text-3)" }} />
            Bio completa explicando seu método e diferencial
          </li>
        </ul>
        <Link
          href="/instructor/perfil"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--vl-accent)", color: "#ffffff" }}
        >
          Completar perfil
        </Link>
      </div>
    </section>
  );
}
