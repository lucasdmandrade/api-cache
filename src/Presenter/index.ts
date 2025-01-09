import { useState, useEffect, useCallback } from 'react';
import { storage } from '../Entity/storage';
import { createCachedFetch } from '../Interactor/cache';
import { createFetchHandler } from '../Interactor/api';
import type { CacheOptions } from '../Entity/storage/types';
import { AppState } from 'react-native';
import { createBackgroundFetchsHandler } from '../Interactor/background';
import { useBackgroundFetchsOberver } from '../Entity/backgroundFetchs';
import { useBackgroundFetchsObserver } from '../Entity/backgroundFetchs/context';

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

  const handleResult = useCallback(
    (result?: T) => {
      console.log('Result updated');
      if (JSON.stringify(result) !== JSON.stringify(data)) {
        setData(result);
      }
    },
    [data]
  );

  const backgroundFetchsOberver = useBackgroundFetchsObserver<T>(
    key,
    handleResult
  );

  const fetchData = useCallback(async () => {
    const interactor = createCachedFetch(storage);
    const fetchHandler = createFetchHandler(interactor.fetchData);

    const backgroundHandler = createBackgroundFetchsHandler(
      backgroundFetchsOberver,
      key,
      async () =>
        await fetchHandler.attemptFetch(
          key,
          requestFn,
          options,
          (result) => {
            if (JSON.stringify(result) !== JSON.stringify(data)) {
              setData(result);
            }
          },
          (err) => {
            if (JSON.stringify(err) !== JSON.stringify(error)) setError(err);
          }
        )
    );

    await backgroundHandler.fetcher();
  }, [backgroundFetchsOberver, key, requestFn, options, data, error]);

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

  return { data, error: data ? null : error, refetch: fetchData };
}
