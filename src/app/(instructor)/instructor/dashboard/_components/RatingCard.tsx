import { Star } from "lucide-react";

interface Props {
  avgRating: number | null;
  ratingsCount: number;
}

export default function RatingCard({ avgRating, ratingsCount }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
        >
          <Star size={16} />
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-2xl font-bold leading-none"
          style={{ color: "var(--vl-text-1)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {avgRating !== null ? avgRating.toFixed(1).replace(".", ",") : "—"}
        </span>
        {avgRating !== null && (
          <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>de 5,0</span>
        )}
      </div>
      <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--vl-text-3)" }}>
        Avaliação média
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
        {avgRating !== null ? `Baseado em ${ratingsCount} avaliação${ratingsCount !== 1 ? "ões" : ""}` : "Sem avaliações ainda"}
      </p>
    </div>
  );
}
