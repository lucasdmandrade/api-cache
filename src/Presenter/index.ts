import { useState, useEffect, useCallback } from 'react';
import type { UseQueryError } from '../Entity';
import { createMemoryCache } from '../Entity/storage';
import { createCachedFetch } from '../Interactor/cache';
import { createFetchHandler } from '../Interactor/api';
import type { CacheOptions } from '../Entity/storage/types';

/**
 * Hook para buscar dados com cache.
 * @template T - O tipo de dado esperado pela requisição.
 * @param {string} key - Chave do cache.
 * @param {() => Promise<T>} requestFn - Função para realizar a requisição.
 * @param {CacheOptions} options - Opções de cache.
 * @returns {{ data: T | undefined, error: UseQueryError | null, isLoading: boolean, refetch: () => Promise<void> }}
 */
export function useQuery<T>(
  key: string,
  requestFn: () => Promise<T>,
  options: CacheOptions
) {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<UseQueryError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedRequestFn = useCallback(() => requestFn(), [requestFn]);

  const fetchData = useCallback(async () => {
    const cache = createMemoryCache();
    const interactor = createCachedFetch(cache);
    const fetchHandler = createFetchHandler(interactor.fetchData);

    await fetchHandler.loadData(
      key,
      memoizedRequestFn,
      options,
      (result) => {
        setData(result);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );
  }, [key, options, memoizedRequestFn]);

  useEffect(() => {
    fetchData();
  }, [key, fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
