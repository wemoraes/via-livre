"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Search, SlidersHorizontal, X, MapIcon, List } from "lucide-react";
import InstructorCard from "@/components/features/instructors/InstructorCard";
import { searchInstructors } from "@/actions/search";
import type { InstructorSearchResult, SearchFilters } from "@/actions/search";
import { VehicleCategory } from "@prisma/client";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const DEFAULT_CENTER = { lat: -23.5505, lng: -46.6333 };

const inputSm = "px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 bg-white/60";

export default function InstructoresPage() {
  const [view, setView] = useState<"list" | "map">("list");
  const [instructors, setInstructors] = useState<InstructorSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({ page: 1, limit: 20 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback((f: SearchFilters) => {
    startTransition(async () => {
      const result = await searchInstructors(f);
      if (result.success) { setInstructors(result.data.instructors); setTotal(result.data.total); }
    });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter(center);
          const f = { ...filters, lat: center.lat, lng: center.lng };
          setFilters(f);
          load(f);
        },
        () => load(filters),
      );
    } else {
      load(filters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters(partial: Partial<SearchFilters>) {
    const updated = { ...filters, ...partial, page: 1 };
    setFilters(updated);
    load(updated);
  }

  function handleCitySearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) applyFilters({ city: query.trim() });
  }

  return (
    <APIProvider apiKey={MAPS_KEY}>
      <div className="min-h-screen" style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}>
        <div aria-hidden className="vl-mesh" />

        {/* Sticky header — glassmorphism */}
        <header
          className="sticky top-0 z-20"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <form onSubmit={handleCitySearch} className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--vl-text-3)" }} />
              <input
                type="search"
                placeholder="Buscar por cidade…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none vl-input"
              />
            </form>

            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-colors"
              style={{
                borderColor: filtersOpen ? "var(--vl-accent)" : "rgba(13,18,16,0.12)",
                color: filtersOpen ? "var(--vl-accent)" : "var(--vl-text-2)",
                background: filtersOpen ? "oklch(92% 0.07 145)" : "rgba(255,255,255,0.55)",
              }}
            >
              <SlidersHorizontal size={15} />
              Filtros
            </button>

            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(13,18,16,0.12)" }}>
              {(["list", "map"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className="px-3 py-2 transition-colors"
                  style={{
                    background: view === v ? "rgba(13,18,16,0.07)" : "rgba(255,255,255,0.55)",
                    color: view === v ? "var(--vl-text-1)" : "var(--vl-text-3)",
                  }}
                  aria-label={v === "list" ? "Ver lista" : "Ver mapa"}
                >
                  {v === "list" ? <List size={15} /> : <MapIcon size={15} />}
                </button>
              ))}
            </div>
          </div>

          {filtersOpen && (
            <div
              className="px-4 py-3"
              style={{ borderTop: "1px solid rgba(13,18,16,0.06)" }}
            >
              <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--vl-text-3)" }}>Preço máx. (R$)</label>
                  <input
                    type="number" min={50} max={500} step={10} placeholder="500"
                    className={`${inputSm} w-24`}
                    style={{ borderColor: "rgba(13,18,16,0.12)" }}
                    onChange={(e) => applyFilters({ maxPrice: Number(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--vl-text-3)" }}>Avaliação mínima</label>
                  <select
                    className={`${inputSm} bg-white/60`}
                    style={{ borderColor: "rgba(13,18,16,0.12)" }}
                    onChange={(e) => applyFilters({ minRating: Number(e.target.value) || undefined })}
                  >
                    <option value="">Qualquer</option>
                    <option value="4">4+ estrelas</option>
                    <option value="4.5">4.5+ estrelas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--vl-text-3)" }}>Categoria</label>
                  <select
                    className={`${inputSm} bg-white/60`}
                    style={{ borderColor: "rgba(13,18,16,0.12)" }}
                    onChange={(e) => applyFilters({ category: (e.target.value as VehicleCategory) || undefined })}
                  >
                    <option value="">Todas</option>
                    <option value="AUTO">Automóvel</option>
                    <option value="MOTO">Motocicleta</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => { setFilters({ page: 1, limit: 20 }); setQuery(""); load({ page: 1, limit: 20 }); }}
                  className="flex items-center gap-1 text-xs hover:opacity-70"
                  style={{ color: "var(--vl-text-3)" }}
                >
                  <X size={12} />
                  Limpar
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-sm mb-4" style={{ color: "var(--vl-text-3)" }}>
            {isPending ? "Buscando…" : `${total} instrutor${total !== 1 ? "es" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>

          {view === "list" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
              {!isPending && instructors.length === 0 && (
                <div className="col-span-full text-center py-16 text-sm" style={{ color: "var(--vl-text-3)" }}>
                  Nenhum instrutor encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ height: "calc(100vh - 200px)", border: "1px solid rgba(255,255,255,0.6)" }}>
              <Map defaultCenter={mapCenter} defaultZoom={12} mapId="via-livre-instructor-map" gestureHandling="greedy">
                {instructors.map((instructor) =>
                  instructor.lat && instructor.lng ? (
                    <AdvancedMarker
                      key={instructor.id}
                      position={{ lat: instructor.lat, lng: instructor.lng }}
                      onClick={() => setSelectedId(instructor.id)}
                    >
                      <Pin
                        background={selectedId === instructor.id ? "oklch(52% 0.17 145)" : "#ffffff"}
                        borderColor="oklch(52% 0.17 145)"
                        glyphColor={selectedId === instructor.id ? "#ffffff" : "oklch(52% 0.17 145)"}
                      />
                    </AdvancedMarker>
                  ) : null
                )}
              </Map>

              {selectedId && (() => {
                const inst = instructors.find((i) => i.id === selectedId);
                if (!inst) return null;
                return (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 z-10">
                    <InstructorCard instructor={inst} />
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="absolute top-2 right-2 hover:opacity-70"
                      style={{ color: "var(--vl-text-3)" }}
                      aria-label="Fechar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </APIProvider>
  );
}
