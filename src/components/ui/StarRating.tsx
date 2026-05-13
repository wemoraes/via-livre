import { Star } from "lucide-react";

interface Props {
  score: number; // 1-5 (decimals supported for averages)
  size?: number;
  showValue?: boolean;
}

export default function StarRating({ score, size = 14, showValue = false }: Props) {
  const filled = Math.round(score);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${score} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          strokeWidth={1.5}
        />
      ))}
      {showValue && (
        <span
          className="text-xs ml-1"
          style={{ color: "var(--vl-text-3)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {score.toFixed(1).replace(".", ",")}
        </span>
      )}
    </span>
  );
}
