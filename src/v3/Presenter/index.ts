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
  console.log('useQuery');
  const [error, setError] = useState<any>();
  const [data, setData] = useState<T>();

  const { fetchData: cachedFetcher } = useCache<T>();
  const { isFetching, removeFetch, setNewFetch, refreshIsFetching } =
    useBackgroundFetchs(key);

  const fetchData = useCallback(async () => {
    try {
      console.log('fetchData');
      refreshIsFetching();
      console.log('isFetching', isFetching);
      if (isFetching) return;
      setNewFetch();
      const response = await cachedFetcher(key, requestFn, options);

      console.log(
        '(JSON.stringify(response) !== JSON.stringify(data)',
        JSON.stringify(response) !== JSON.stringify(data)
      );
      if (JSON.stringify(response) !== JSON.stringify(data)) setData(response);
      setError(null);
    } catch (e) {
      console.log('fetchData ERROR', e);
      if (JSON.stringify(e) !== JSON.stringify(error)) {
        setError(e);
      }
      throw e;
    } finally {
      console.log('endFetching');
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
