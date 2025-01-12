import { useState, useEffect, useCallback } from 'react';
import { Environment, useCache } from '../Interactor/cache';
import type { CacheOptions } from '../Entity/storage/types';
// import { AppState } from 'react-native';

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
  // const [appState, setAppState] = useState(AppState.currentState);
  const [error, setError] = useState<any>();

  const { environment, storeData, data } = useCache<T>(key, options);

  const fetchData = useCallback(async () => {
    console.log('fetchData');
    try {
      if (environment === Environment.CACHE) return;
      const response = await requestFn();
      storeData(response);
    } catch (e) {
      console.log('fetchData ERROR', e);
      if (JSON.stringify(e) !== JSON.stringify(error)) {
        setError(e);
      }
      throw e;
    }
  }, [environment, error, requestFn, storeData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', (nextAppState) => {
  //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //       fetchData();
  //     }
  //     setAppState(nextAppState);
  //   });

  //   return () => subscription.remove();
  // }, [appState, fetchData]);

  return {
    data,
    error: data ? null : error,
    refetch: fetchData,
  };
}
