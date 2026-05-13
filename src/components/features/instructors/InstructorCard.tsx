import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Car } from "lucide-react";
import AprovometroTag from "./AprovometroTag";
import type { InstructorSearchResult } from "@/actions/search";
import { VehicleCategory } from "@prisma/client";

const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  AUTO: "Automóvel",
  MOTO: "Moto",
};

interface Props {
  instructor: InstructorSearchResult;
}

export default function InstructorCard({ instructor }: Props) {
  const { id, name, avatarUrl, bio, city, state, pricePerLesson, aprovometro, aprovometroCount, rating, ratingCount, categories, distanceKm } = instructor;

  return (
    <Link
      href={`/instrutores/${id}`}
      className="glass-card rounded-2xl block p-5 hover:shadow-lg transition-all"
      style={{ textDecoration: "none" }}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} width={56} height={56} className="rounded-full object-cover w-14 h-14" />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
              style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm truncate" style={{ color: "var(--vl-text-1)" }}>{name}</h3>
            <span className="text-sm font-semibold shrink-0" style={{ color: "var(--vl-accent)" }}>
              R$ {pricePerLesson}/aula
            </span>
          </div>

          {(city || state) && (
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--vl-text-3)" }}>
              <MapPin size={12} />
              {[city, state].filter(Boolean).join(", ")}
              {distanceKm !== undefined && (
                <span>· {distanceKm < 1 ? "<1" : Math.round(distanceKm)} km</span>
              )}
            </p>
          )}

          {bio && (
            <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: "var(--vl-text-3)" }}>{bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <AprovometroTag aprovometro={aprovometro} aprovometroCount={aprovometroCount} size="sm" />

            {rating !== null && (
              <span className="inline-flex items-center gap-0.5 text-xs" style={{ color: "oklch(55% 0.12 85)" }}>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {rating}
                <span style={{ color: "var(--vl-text-3)" }}>({ratingCount})</span>
              </span>
            )}

            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                style={{ color: "var(--vl-text-3)", background: "rgba(13,18,16,0.05)" }}
              >
                <Car size={10} />
                {CATEGORY_LABEL[cat]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
