import type { CacheOptions, CacheStorage } from '../Entity';

/**
 * Cria um interactor para gerenciar o cache.
 * @param {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void }} cacheStorage - Sistema de armazenamento em cache.
 * @returns {{ fetchData: (key: string, requestFn: () => Promise<any>, options?: CacheOptions) => Promise<any> }}
 */
export function createCacheInteractor(cacheStorage: CacheStorage) {
  const fetchData = async (
    key: string,
    requestFn: () => Promise<any>,
    options: CacheOptions
  ) => {
    const { staleTime = 60000 } = options;
    console.log('cacheStorage1');
    console.log('cacheStorage2', cacheStorage.get(key));
    const cachedData = cacheStorage.get(key);
    console.log('cachedData', cachedData);

    if (cachedData && Date.now() - cachedData.timestamp < staleTime) {
      return cachedData.data;
    }

    const data = await requestFn();
    cacheStorage.set(key, { data, timestamp: Date.now() });
    return data;
  };
  return {
    cache: cacheStorage,
    fetchData,
  };
}

/**
 * Cria um sistema de armazenamento em cache na memória.
 * @returns {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void, clear: () => void }}
 */
export function createMemoryCache() {
  const store = new Map();

  return {
    get(key: string) {
      console.log('GET', key);
      return store.get(key) || null;
    },
    set(key: string, value: any) {
      store.set(key, value);
    },
    clear() {
      store.clear();
    },
  };
}
