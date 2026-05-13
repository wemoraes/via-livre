import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Star, Car } from "lucide-react";
import { getInstructorPublicProfile } from "@/actions/search";

export const dynamic = "force-dynamic";
import AprovometroTag from "@/components/features/instructors/AprovometroTag";
import { VehicleCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";

const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  AUTO: "Automóvel",
  MOTO: "Motocicleta",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InstructorProfilePage({ params }: Props) {
  const { id } = await params;
  const result = await getInstructorPublicProfile(id);
  if (!result.success) notFound();

  const inst = result.data;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/instrutores"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={14} />
          Voltar à busca
        </Link>

        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-5">
            {inst.avatarUrl ? (
              <Image
                src={inst.avatarUrl}
                alt={inst.name}
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-semibold text-gray-400 shrink-0">
                {inst.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">{inst.name}</h1>

              {(inst.city || inst.state) && (
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={13} />
                  {[inst.city, inst.state].filter(Boolean).join(", ")}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <AprovometroTag aprovometro={inst.aprovometro} aprovometroCount={inst.aprovometroCount} />

                {inst.rating !== null && (
                  <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {inst.rating}
                    <span className="text-gray-400 text-xs">({inst.ratingCount} avaliações)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-[oklch(55%_0.17_145)]">R$ {inst.pricePerLesson}</p>
              <p className="text-xs text-gray-400">por aula</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {inst.fullBio && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Sobre</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{inst.fullBio}</p>
          </div>
        )}

        {/* Categories */}
        {inst.categories.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Categorias de aula</h2>
            <div className="flex flex-wrap gap-2">
              {inst.categories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1.5 text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100">
                  <Car size={13} />
                  {CATEGORY_LABEL[cat]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Areas */}
        {inst.areas.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Bairros atendidos</h2>
            <div className="flex flex-wrap gap-2">
              {inst.areas.map((area) => (
                <span key={area} className="text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-100">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link href={`/agendar/${inst.id}`}>
          <Button className="w-full" size="lg">
            Agendar aula
          </Button>
        </Link>
      </div>
    </main>
  );
}
