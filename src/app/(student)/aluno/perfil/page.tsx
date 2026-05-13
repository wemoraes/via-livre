import { User } from "lucide-react";

export default function StudentPerfilPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
        Perfil
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--vl-text-3)" }}>
        Seus dados pessoais, avatar e preferências.
      </p>

      <div className="glass-card rounded-2xl p-10 text-center">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{ background: "rgba(13,18,16,0.06)", color: "var(--vl-text-3)" }}
        >
          <User size={22} />
        </span>
        <h2 className="text-base font-medium mb-2" style={{ color: "var(--vl-text-1)" }}>
          Em construção
        </h2>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--vl-text-3)" }}>
          Story 8.1e — Edição de nome, foto/avatar, telefone, preferências e perf budget {"<"} 2s LCP.
        </p>
      </div>
    </div>
  );
}
