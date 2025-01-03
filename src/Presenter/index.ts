import { useState, useEffect, useCallback } from 'react';
import { storage } from '../Entity/storage';
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
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (isLoading) return;

    const interactor = createCachedFetch(storage);
    const fetchHandler = createFetchHandler(interactor.fetchData);

    try {
      await fetchHandler.loadData(
        key,
        requestFn,
        options,
        (result) => {
          if (JSON.stringify(result) !== JSON.stringify(data)) setData(result);
        },
        (err) => {
          setError(err);
        }
      );
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [key, requestFn, options, data, isLoading]);

  useEffect(() => {
    fetchData();
  }, [key, fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
