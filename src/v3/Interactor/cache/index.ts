import { useStorage } from '../../Entity/storage';
import type { CacheOptions } from '../../Entity/storage/types';

/**
 * Cria um interactor para gerenciar o cache.
 * @param {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void }} cacheStorage - Sistema de armazenamento em cache.
 * @returns {{ fetchData: (key: string, requestFn: () => Promise<any>, options?: CacheOptions) => Promise<any> }}
 */
export function useCache<T>() {
  const storage = useStorage<T>();

  const fetchData = async (
    key: string,
    requestFn: () => Promise<any>,
    options: CacheOptions
  ) => {
    console.log('fetchData cache');
    const { staleTime = 60000 } = options;

    const cachedData = await storage.get(key);

    if (!cachedData) {
      const data = await requestFn();

      await storage.set(key, { data, timestamp: Date.now() });
      return data;
    }

    const parsedData = cachedData;

    if (Date.now() - parsedData.timestamp < staleTime) {
      console.log('RETURN CACHE');
      return parsedData.data;
    }

    const data = await requestFn();

    await storage.set(key, {
      data: data,
      timestamp: Date.now(),
    });
    return data;
  };
  return {
    cache: storage,
    fetchData,
  };
}
