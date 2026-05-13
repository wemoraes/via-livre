"use server";

import { prisma } from "@/lib/db";
import { getCache, setCache } from "@/lib/redis";
import { ok, err } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { InstructorStatus, VehicleCategory, UserRole } from "@prisma/client";

export interface InstructorSearchResult {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  lat: number | null;
  lng: number | null;
  pricePerLesson: number;
  serviceRadius: number;
  aprovometro: number | null;
  aprovometroCount: number;
  rating: number | null;
  ratingCount: number;
  categories: VehicleCategory[];
  distanceKm?: number;
}

export interface SearchFilters {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  city?: string;
  state?: string;
  maxPrice?: number;
  minRating?: number;
  category?: VehicleCategory;
  page?: number;
  limit?: number;
}

export async function searchInstructors(
  filters: SearchFilters,
): Promise<ActionResult<{ instructors: InstructorSearchResult[]; total: number }>> {
  const { lat, lng, radiusKm = 20, city, state, maxPrice, minRating, category, page = 1, limit = 20 } = filters;

  const cacheKey = `search:${JSON.stringify(filters)}`;
  const cached = await getCache<{ instructors: InstructorSearchResult[]; total: number }>(cacheKey);
  if (cached) return ok(cached);

  const profiles = await prisma.instructorProfile.findMany({
    where: {
      status: InstructorStatus.ACTIVE,
      ...(maxPrice ? { pricePerLesson: { lte: maxPrice } } : {}),
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      ...(state ? { state: { equals: state } } : {}),
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          ratingsReceived: {
            where: { role: UserRole.STUDENT },
            select: { score: true },
          },
        },
      },
      vehicles: {
        where: { active: true },
        select: { category: true },
      },
    },
    take: limit * 5,
    orderBy: { aprovometro: { sort: "asc", nulls: "last" } },
  });

  let results: InstructorSearchResult[] = profiles.map((p) => {
    const scores = p.user.ratingsReceived.map((r) => r.score);
    const ratingAvg = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : null;

    let distanceKm: number | undefined;
    if (lat && lng && p.lat && p.lng) {
      distanceKm = haversineKm(lat, lng, p.lat, p.lng);
    }

    const categories = [...new Set(p.vehicles.map((v) => v.category))] as VehicleCategory[];

    return {
      id: p.id,
      userId: p.userId,
      name: p.user.name ?? "Instrutor",
      avatarUrl: p.user.image,
      bio: p.bio,
      city: p.city,
      state: p.state,
      lat: p.lat,
      lng: p.lng,
      pricePerLesson: Number(p.pricePerLesson),
      serviceRadius: p.serviceRadius,
      aprovometro: p.aprovometro,
      aprovometroCount: p.aprovometroCount,
      rating: ratingAvg,
      ratingCount: scores.length,
      categories,
      distanceKm,
    };
  });

  if (lat && lng) {
    results = results.filter((r) => {
      if (!r.lat || !r.lng) return false;
      const d = haversineKm(lat, lng, r.lat, r.lng);
      return d <= Math.min(radiusKm, r.serviceRadius);
    });
    results.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }

  if (minRating) {
    results = results.filter((r) => r.rating !== null && r.rating >= minRating);
  }

  if (category) {
    results = results.filter((r) => r.categories.includes(category));
  }

  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);
  const payload = { instructors: paginated, total };

  await setCache(cacheKey, payload, 300);
  return ok(payload);
}

export async function getInstructorPublicProfile(
  instructorId: string,
): Promise<ActionResult<InstructorSearchResult & { fullBio: string | null; areas: string[] }>> {
  const profile = await prisma.instructorProfile.findUnique({
    where: { id: instructorId, status: InstructorStatus.ACTIVE },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          ratingsReceived: {
            where: { role: UserRole.STUDENT },
            select: { score: true },
          },
        },
      },
      vehicles: { where: { active: true }, select: { category: true } },
    },
  });

  if (!profile) return err("Instrutor não encontrado");

  const scores = profile.user.ratingsReceived.map((r) => r.score);
  const ratingAvg = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : null;

  const categories = [...new Set(profile.vehicles.map((v) => v.category))] as VehicleCategory[];

  return ok({
    id: profile.id,
    userId: profile.userId,
    name: profile.user.name ?? "Instrutor",
    avatarUrl: profile.user.image,
    bio: profile.bio,
    fullBio: profile.bio,
    city: profile.city,
    state: profile.state,
    lat: profile.lat,
    lng: profile.lng,
    pricePerLesson: Number(profile.pricePerLesson),
    serviceRadius: profile.serviceRadius,
    aprovometro: profile.aprovometro,
    aprovometroCount: profile.aprovometroCount,
    rating: ratingAvg,
    ratingCount: scores.length,
    categories,
    areas: profile.areas,
  });
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
