type CachedData = any;

export interface CacheStorage {
  get: (key: string) => CachedData | null;
  set: (key: string, value: CachedData) => void;
}

export interface CacheOptions {
  staleTime?: number;
}

export interface Interactor {
  fetchData: (
    key: string,
    requestFn: () => Promise<any>,
    options?: CacheOptions
  ) => Promise<any>;
}
