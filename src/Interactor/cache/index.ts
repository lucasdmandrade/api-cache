import type {
  CacheData,
  CacheOptions,
  CacheStorage,
} from '../../Entity/storage/types';

/**
 * Cria um interactor para gerenciar o cache.
 * @param {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void }} cacheStorage - Sistema de armazenamento em cache.
 * @returns {{ fetchData: (key: string, requestFn: () => Promise<any>, options?: CacheOptions) => Promise<any> }}
 */
export function createCachedFetch<T>(cacheStorage: CacheStorage) {
  const fetchData = async (
    key: string,
    requestFn: () => Promise<any>,
    options: CacheOptions
  ) => {
    console.log('fetchData');
    const { staleTime = 60000 } = options;

    const cachedData = cacheStorage.get(key);

    if (!cachedData) {
      const data = await requestFn();

      cacheStorage.set(key, { data, timestamp: Date.now() });
      return data;
    }

    const parsedData = JSON.parse(cachedData) as CacheData<T>;

    if (Date.now() - parsedData.timestamp < staleTime) {
      return parsedData.data;
    }

    const data = await requestFn();

    cacheStorage.set(key, {
      data: data,
      timestamp: Date.now(),
    });
    return data;
  };
  return {
    cache: cacheStorage,
    fetchData,
  };
}
