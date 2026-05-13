"use client";

import { useCallback } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  count: number;
}

export default function RatingPrompt({ count }: Props) {
  const handleClick = useCallback(() => {
    const el = document.querySelector("[data-pending-rating='true']");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  if (count === 0) return null;

  const label = count === 1 ? "1 aula para avaliar" : `${count} aulas para avaliar`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="glass-card rounded-2xl flex items-center gap-3 p-4 w-full text-left mb-4 hover:shadow-lg transition-all"
      style={{ borderColor: "var(--vl-accent)" }}
    >
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
        style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
      >
        <Sparkles size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: "var(--vl-text-1)" }}>
          Você tem {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
          Suas avaliações ajudam outros alunos a escolherem bem.
        </p>
      </div>
      <span
        className="text-xs font-medium shrink-0"
        style={{ color: "var(--vl-accent)" }}
      >
        Avaliar agora →
      </span>
    </button>
  );
}
