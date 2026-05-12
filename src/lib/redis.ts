import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await redis.get<string>(key);
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : (raw as T);
  } catch {
    return null;
  }
}

export async function invalidateInstructorSearchCache(lat: number, lng: number): Promise<void> {
  // Cache keys use rounded coordinates as region key (1 decimal = ~11km grid)
  const regionKey = `search:${lat.toFixed(1)},${lng.toFixed(1)}`;
  const keys = await redis.keys(`${regionKey}*`);
  if (keys.length > 0) await redis.del(...keys);
}

// Rate limiting: returns remaining attempts (0 = blocked)
export async function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rl:${identifier}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  const remaining = Math.max(0, maxAttempts - count);
  return { allowed: count <= maxAttempts, remaining };
}
