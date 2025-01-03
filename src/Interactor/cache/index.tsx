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
    const { staleTime = 60000 } = options;

    const cachedData = cacheStorage.get(key);

    if (!cachedData) {
      const data = await requestFn();

      cacheStorage.set(key, { data, timestamp: Date.now() });
      return data;
    }

    const parsedData = JSON.parse(cachedData) as CacheData<T>;

    console.warn('cachedData', parsedData || 'vazio');
    console.log('staleTime', staleTime);
    console.log('staleTime', parsedData);
    console.log(' Date.now()', Date.now());
    console.log('cachedData?.timestamp', parsedData?.timestamp);
    console.log(
      'Date.now() - cachedData?.timestamp',
      Date.now() - parsedData?.timestamp
    );

    if (Date.now() - parsedData.timestamp < staleTime) {
      console.log('return cached');
      return parsedData.data;
    }

    console.log('return fetch');
    const data = await requestFn();

    cacheStorage.set(key, { data, timestamp: Date.now() });
    return data;
  };
  return {
    cache: cacheStorage,
    fetchData,
  };
}
