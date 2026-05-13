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
  const {
    id,
    name,
    avatarUrl,
    bio,
    city,
    state,
    pricePerLesson,
    aprovometro,
    aprovometroCount,
    rating,
    ratingCount,
    categories,
    distanceKm,
  } = instructor;

  return (
    <Link
      href={`/instrutores/${id}`}
      className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-400">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{name}</h3>
            <span className="text-sm font-semibold text-[oklch(55%_0.17_145)] shrink-0">
              R$ {pricePerLesson}/aula
            </span>
          </div>

          {/* Location */}
          {(city || state) && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <MapPin size={12} />
              {[city, state].filter(Boolean).join(", ")}
              {distanceKm !== undefined && (
                <span className="text-gray-400">· {distanceKm < 1 ? "<1" : Math.round(distanceKm)} km</span>
              )}
            </p>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{bio}</p>
          )}

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <AprovometroTag aprovometro={aprovometro} aprovometroCount={aprovometroCount} size="sm" />

            {rating !== null && (
              <span className="inline-flex items-center gap-0.5 text-xs text-yellow-600">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {rating}
                <span className="text-gray-400">({ratingCount})</span>
              </span>
            )}

            {categories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
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
