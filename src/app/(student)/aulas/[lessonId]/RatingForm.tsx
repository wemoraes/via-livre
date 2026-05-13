"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { submitRating } from "@/actions/ratings";
import { Button } from "@/components/ui/button";

export default function RatingForm({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!score) return;
    startTransition(async () => {
      const result = await submitRating({ lessonId, score, comment: comment || undefined });
      if (result.success) {
        setSubmitted(true);
        router.refresh();
      }
    });
  }

  if (submitted) {
    return (
      <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
        Avaliação enviada! Obrigado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Avalie o instrutor</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setScore(s)}
            aria-label={`${s} estrela${s > 1 ? "s" : ""}`}
          >
            <Star
              size={24}
              className={`transition-colors ${
                s <= (hovered || score)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        rows={2}
        placeholder="Comentário (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
      />

      <Button onClick={handleSubmit} disabled={!score || isPending} size="sm">
        {isPending ? "Enviando…" : "Enviar avaliação"}
      </Button>
    </div>
  );
}
