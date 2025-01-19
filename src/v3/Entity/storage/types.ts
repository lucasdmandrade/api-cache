export type CachedData = any;

export interface StorageData<T> {
  data: T;
  timestamp: number;
}

export interface StorageMethods<T> {
  get: (key: string) => Promise<StorageData<T>>;
  set: (key: string, value: StorageData<T>) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export interface StorageProviderProps {
  children: React.ReactNode;
  storage: StorageMethods<unknown>;
}

export interface CacheData<T> {
  data: T;
  timestamp: number;
}

export interface CacheOptions {
  staleTime?: number;
  retries?: number;
  retryInterval?: number;
  multiScreen?: boolean;
  storage?: StorageMethods<any>;
}
