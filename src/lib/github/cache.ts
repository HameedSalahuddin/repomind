interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cacheMap = new Map<string, CacheEntry<any>>();

// Default cache TTL: 10 minutes
const DEFAULT_TTL_MS = 10 * 60 * 1000;

export function getFromCache<T>(key: string): T | null {
  const entry = cacheMap.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cacheMap.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setInCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  cacheMap.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}
