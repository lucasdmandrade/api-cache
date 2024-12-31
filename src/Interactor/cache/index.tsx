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

    console.warn('cachedData', cachedData || 'vazio');
    console.log('staleTime', staleTime);
    console.log(' Date.now()', Date.now());
    console.log('cachedData?.timestamp', cachedData?.timestamp);
    console.log(
      'Date.now() - cachedData?.timestamp',
      Date.now() - cachedData?.timestamp
    );

    if (cachedData && Date.now() - cachedData.timestamp < staleTime) {
      console.log('return cached');
      return cachedData.data;
    }

    const data = await requestFn();
    console.log('return new request');

    cacheStorage.set(key, { data, timestamp: Date.now() });
    return data;
  };
  return {
    cache: cacheStorage,
    fetchData,
  };
}
