import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Star, Car } from "lucide-react";
import { getInstructorPublicProfile } from "@/actions/search";
import AprovometroTag from "@/components/features/instructors/AprovometroTag";
import { VehicleCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

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
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-2xl mx-auto">
        <Link
          href="/instrutores"
          className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70"
          style={{ color: "var(--vl-text-3)" }}
        >
          <ArrowLeft size={14} />
          Voltar à busca
        </Link>

        {/* Header card */}
        <div className="glass-card rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-5">
            {inst.avatarUrl ? (
              <Image src={inst.avatarUrl} alt={inst.name} width={80} height={80} className="rounded-full object-cover w-20 h-20 shrink-0" />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-semibold shrink-0"
                style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
              >
                {inst.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold" style={{ color: "var(--vl-text-1)" }}>{inst.name}</h1>

              {(inst.city || inst.state) && (
                <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: "var(--vl-text-3)" }}>
                  <MapPin size={13} />
                  {[inst.city, inst.state].filter(Boolean).join(", ")}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <AprovometroTag aprovometro={inst.aprovometro} aprovometroCount={inst.aprovometroCount} />
                {inst.rating !== null && (
                  <span className="inline-flex items-center gap-1 text-sm" style={{ color: "oklch(55% 0.12 85)" }}>
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {inst.rating}
                    <span className="text-xs" style={{ color: "var(--vl-text-3)" }}>({inst.ratingCount} avaliações)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-2xl font-bold" style={{ color: "var(--vl-accent)" }}>R$ {inst.pricePerLesson}</p>
              <p className="text-xs" style={{ color: "var(--vl-text-3)" }}>por aula</p>
            </div>
          </div>
        </div>

        {inst.fullBio && (
          <div className="glass-card rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>Sobre</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--vl-text-2)" }}>{inst.fullBio}</p>
          </div>
        )}

        {inst.categories.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--vl-text-1)" }}>Categorias de aula</h2>
            <div className="flex flex-wrap gap-2">
              {inst.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                  style={{ color: "var(--vl-text-2)", background: "rgba(13,18,16,0.05)", border: "1px solid rgba(13,18,16,0.08)" }}
                >
                  <Car size={13} />
                  {CATEGORY_LABEL[cat]}
                </span>
              ))}
            </div>
          </div>
        )}

        {inst.areas.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--vl-text-1)" }}>Bairros atendidos</h2>
            <div className="flex flex-wrap gap-2">
              {inst.areas.map((area) => (
                <span
                  key={area}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ color: "var(--vl-text-3)", background: "rgba(13,18,16,0.05)", border: "1px solid rgba(13,18,16,0.06)" }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link href={`/agendar/${inst.id}`}>
          <Button className="w-full" size="lg">Agendar aula</Button>
        </Link>
      </div>
    </main>
  );
}
