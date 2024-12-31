import { useState, useEffect, useCallback } from 'react';
import type { UseQueryError } from '../Entity';
import { createMemoryCache } from '../Entity/storage';
import { createCachedFetch } from '../Interactor/cache';
import { createFetchHandler } from '../Interactor/api';
import type { CacheOptions } from '../Entity/storage/types';

/**
 * Hook para buscar dados com cache.
 * @param {string} key - Chave do cache.
 * @param {() => Promise<any>} requestFn - Função para realizar a requisição.
 * @param {CacheOptions} options - Opções de cache.
 * @returns {{ data: any, error: any, isLoading: boolean }}
 */

export function useQuery(
  key: string,
  requestFn: () => Promise<any>,
  options: CacheOptions
) {
  const [data, setData] = useState();
  const [error, setError] = useState<UseQueryError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedRequestFn = useCallback(() => {
    console.log('memoizedRequestFn called');
    return requestFn();
  }, [requestFn]);

  const fetchData = useCallback(async () => {
    console.log('fetchData');
    const cache = createMemoryCache();
    console.log('createMemoryCache');
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
