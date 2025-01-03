export type CachedData = any;

export interface CacheStorage {
  get: (key: string) => string | null;
  set: (key: string, value: CachedData) => void;
}

export interface CacheData<T> {
  data: T;
  timestamp: number;
}

export interface CacheOptions {
  staleTime?: number;
}
