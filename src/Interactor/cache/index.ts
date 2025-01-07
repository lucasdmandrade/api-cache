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

      console.log('createCachedFetch', data);

      cacheStorage.set(key, { data, timestamp: Date.now() });
      return data;
    }

    console.log('createCachedFetch', cachedData);
    console.log('typeof cachedData === string', typeof cachedData === 'string');
    console.log('tJSON.parse(cachedData)', JSON.parse(cachedData));

    const parsedData = JSON.parse(cachedData) as CacheData<T>;

    if (Date.now() - parsedData.timestamp < staleTime) {
      console.log('return cached');
      return parsedData.data;
    }

    console.log('return fetch');
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
