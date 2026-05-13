"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Check } from "lucide-react";
import { submitRating } from "@/actions/ratings";

interface Props {
  lessonId: string;
  /** Display label for who is being rated. */
  targetLabel: "instrutor" | "aluno";
}

export default function RatingForm({ lessonId, targetLabel }: Props) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!score) return;
    setError(null);
    startTransition(async () => {
      const result = await submitRating({ lessonId, score, comment: comment || undefined });
      if (result.success) {
        setSubmitted(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div
        className="flex items-center gap-2 text-sm rounded-xl px-3 py-2"
        style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
      >
        <Check size={14} />
        Avaliação enviada! Obrigado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold" style={{ color: "var(--vl-text-1)" }}>
        Avalie o {targetLabel}
      </p>

      <div className="flex gap-1" role="radiogroup" aria-label={`Nota para o ${targetLabel}`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setScore(s)}
            aria-label={`${s} estrela${s > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={score === s}
          >
            <Star
              size={28}
              className={`transition-colors ${
                s <= (hovered || score) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      <textarea
        rows={2}
        placeholder="Conte como foi a aula (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        className="vl-input resize-none"
      />

      {error && (
        <p className="text-sm" style={{ color: "oklch(50% 0.15 25)" }}>{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!score || isPending}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
        style={{ background: "var(--vl-accent)", color: "#ffffff" }}
      >
        {isPending ? "Enviando…" : "Enviar avaliação"}
      </button>
    </div>
  );
}
