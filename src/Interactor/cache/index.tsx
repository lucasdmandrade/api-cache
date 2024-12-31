import type { CacheOptions, CacheStorage } from '../../Entity/storage/types';

/**
 * Cria um interactor para gerenciar o cache.
 * @param {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void }} cacheStorage - Sistema de armazenamento em cache.
 * @returns {{ fetchData: (key: string, requestFn: () => Promise<any>, options?: CacheOptions) => Promise<any> }}
 */
export function createCachedFetch(cacheStorage: CacheStorage) {
  const fetchData = async (
    key: string,
    requestFn: () => Promise<any>,
    options: CacheOptions
  ) => {
    const { staleTime = 60000 } = options;

    const cachedData = cacheStorage.get(key);

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
