import { useState, useEffect, useCallback } from 'react';
import { Environment, useCache } from '../Interactor/cache';
import type { CacheOptions } from '../Entity/storage/types';
import { useRequest } from '../Interactor/api';

/**
 * Hook para buscar dados com cache.
 * @template T - O tipo de dado esperado pela requisição.
 * @param {string} key - Chave do cache.
 * @param {() => Promise<T>} requestFn - Função para realizar a requisição.
 * @param {CacheOptions} options - Opções de cache.
 * @returns {{ data: T | undefined, error: UseQueryError | null, isLoading: boolean, refetch: () => Promise<void> }}
 */

export function useQueryv2<T>(
  key: string,
  requestFn: () => Promise<T>,
  options: CacheOptions
) {
  console.log('useQuery');
  const [error, setError] = useState<any>();

  const { environment, storeData, data } = useCache<T>(key, options);
  const { attemptFetch } = useRequest<T>();

  const fetchData = useCallback(async () => {
    console.log('fetchData');
    try {
      if (environment === Environment.CACHE) return;
      const response = await attemptFetch(requestFn, options);
      storeData(response);
      setError(null);
    } catch (e) {
      console.log('fetchData ERROR', e);
      if (JSON.stringify(e) !== JSON.stringify(error)) {
        setError(e);
      }
      throw e;
    }
  }, [attemptFetch, environment, error, options, requestFn, storeData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error: error,
    refetch: fetchData,
  };
}
