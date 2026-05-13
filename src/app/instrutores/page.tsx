"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Search, SlidersHorizontal, X, MapIcon, List } from "lucide-react";
import InstructorCard from "@/components/features/instructors/InstructorCard";
import { searchInstructors } from "@/actions/search";
import type { InstructorSearchResult, SearchFilters } from "@/actions/search";
import { VehicleCategory } from "@prisma/client";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const DEFAULT_CENTER = { lat: -23.5505, lng: -46.6333 }; // São Paulo

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
      if (result.success) {
        setInstructors(result.data.instructors);
        setTotal(result.data.total);
      }
    });
  }, []);

  useEffect(() => {
    // Try to geolocate the user for better defaults
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
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <form onSubmit={handleCitySearch} className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar por cidade…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)] focus:border-transparent"
              />
            </form>

            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-colors ${
                filtersOpen ? "border-[oklch(55%_0.17_145)] text-[oklch(55%_0.17_145)]" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filtros
            </button>

            {/* View toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-3 py-2 ${view === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                aria-label="Ver lista"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`px-3 py-2 ${view === "map" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                aria-label="Ver mapa"
              >
                <MapIcon size={15} />
              </button>
            </div>
          </div>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="border-t border-gray-100 bg-white px-4 py-3">
              <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Preço máx. (R$)</label>
                  <input
                    type="number"
                    min={50}
                    max={500}
                    step={10}
                    placeholder="500"
                    className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      applyFilters({ maxPrice: v || undefined });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Avaliação mínima</label>
                  <select
                    className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
                    onChange={(e) => applyFilters({ minRating: Number(e.target.value) || undefined })}
                  >
                    <option value="">Qualquer</option>
                    <option value="4">4+ estrelas</option>
                    <option value="4.5">4.5+ estrelas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Categoria</label>
                  <select
                    className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
                    onChange={(e) =>
                      applyFilters({ category: (e.target.value as VehicleCategory) || undefined })
                    }
                  >
                    <option value="">Todas</option>
                    <option value="AUTO">Automóvel</option>
                    <option value="MOTO">Motocicleta</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFilters({ page: 1, limit: 20 });
                    setQuery("");
                    load({ page: 1, limit: 20 });
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
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
          {/* Result count */}
          <p className="text-sm text-gray-500 mb-4">
            {isPending ? "Buscando…" : `${total} instrutor${total !== 1 ? "es" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>

          {view === "list" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}

              {!isPending && instructors.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                  Nenhum instrutor encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ height: "calc(100vh - 200px)" }}>
              <Map
                defaultCenter={mapCenter}
                defaultZoom={12}
                mapId="via-livre-instructor-map"
                gestureHandling="greedy"
              >
                {instructors.map((instructor) =>
                  instructor.lat && instructor.lng ? (
                    <AdvancedMarker
                      key={instructor.id}
                      position={{ lat: instructor.lat, lng: instructor.lng }}
                      onClick={() => setSelectedId(instructor.id)}
                    >
                      <Pin
                        background={
                          selectedId === instructor.id ? "oklch(55% 0.17 145)" : "#ffffff"
                        }
                        borderColor="oklch(55% 0.17 145)"
                        glyphColor={selectedId === instructor.id ? "#ffffff" : "oklch(55% 0.17 145)"}
                      />
                    </AdvancedMarker>
                  ) : null
                )}
              </Map>

              {/* Selected instructor card overlay */}
              {selectedId && (() => {
                const inst = instructors.find((i) => i.id === selectedId);
                if (!inst) return null;
                return (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 z-10">
                    <InstructorCard instructor={inst} />
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
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
