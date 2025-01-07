import { useState, useEffect, useCallback } from 'react';
import { storage } from '../Entity/storage';
import { createCachedFetch } from '../Interactor/cache';
import { createFetchHandler } from '../Interactor/api';
import type { CacheOptions } from '../Entity/storage/types';
import { AppState } from 'react-native';
import { createBackgroundFetchsHandler } from '../Interactor/background';

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
  console.log('useQuery');
  const [appState, setAppState] = useState(AppState.currentState);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const interactor = createCachedFetch(storage);
    const fetchHandler = createFetchHandler(interactor.fetchData);
    const fetch = await fetchHandler.fetcher(
      key,
      requestFn,
      options,
      (result) => {
        console.log('result!!!', result);
        if (JSON.stringify(result) !== JSON.stringify(data)) setData(result);
        setIsLoading(false);
      },
      (err) => {
        console.log('presenter err', err);
        console.log('err !== error', err !== error);
        if (JSON.stringify(err) !== JSON.stringify(error)) setError(err);
        // setIsLoading(false);
      }
    );

    const backgroundHandler = createBackgroundFetchsHandler(key, fetch);
    backgroundHandler.fetcher();
  }, [key, requestFn, options, data, error]);

  useEffect(() => {
    fetchData();
  }, [key, fetchData]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        fetchData();
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState, fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
