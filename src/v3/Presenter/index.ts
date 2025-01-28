import { useState, useEffect, useCallback } from 'react';
import { useCache } from '../Interactor/cache';
import type { CacheOptions } from '../Entity/storage/types';
import { useBackgroundFetchs } from '../Interactor/background';

/**
 * Hook para buscar dados com cache.
 * @template T - O tipo de dado esperado pela requisição.
 * @param {string} key - Chave do cache.
 * @param {() => Promise<T>} requestFn - Função para realizar a requisição.
 * @param {CacheOptions} options - Opções de cache.
 * @returns {{ data: T | undefined, error: UseQueryError | null, isLoading: boolean, refetch: () => Promise<void> }}
 */

export function useQueryV3<T>(
  key: string,
  requestFn: () => Promise<T>,
  options: CacheOptions
) {
  const [error, setError] = useState<any>();
  const [data, setData] = useState<T>();

  const { fetchData: cachedFetcher } = useCache<T>();
  const { isFetching, removeFetch, setNewFetch, refreshIsFetching } =
    useBackgroundFetchs(key);

  const fetchData = useCallback(async () => {
    try {
      refreshIsFetching();
      if (isFetching) return;

      setNewFetch();
      const response = await cachedFetcher(key, requestFn, options);

      if (JSON.stringify(response) !== JSON.stringify(data)) setData(response);
      setError(null);
    } catch (e) {
      if (JSON.stringify(e) !== JSON.stringify(error)) {
        setError(e);
      }
      throw e;
    } finally {
      removeFetch();
    }
  }, [
    cachedFetcher,
    data,
    error,
    isFetching,
    key,
    options,
    refreshIsFetching,
    removeFetch,
    requestFn,
    setNewFetch,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error: error,
    refetch: fetchData,
  };
}
