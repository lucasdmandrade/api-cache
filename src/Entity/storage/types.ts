export type CachedData = any;

export interface CacheStorage {
  get: (key: string) => CachedData | null;
  set: (key: string, value: CachedData) => void;
}

export interface CacheOptions {
  staleTime?: number;
}
