import { useState, useEffect, useCallback } from 'react';
import { storage } from '../Entity/storage';
import { createCachedFetch, Environment, useCache } from '../Interactor/cache';
import { createFetchHandler } from '../Interactor/api';
import type { CacheOptions } from '../Entity/storage/types';
import { AppState } from 'react-native';
import { createBackgroundFetchsHandler } from '../Interactor/background';
import { useBackgroundFetchsObserver } from '../Entity/useBackgroundFetchs/context';
import { MMKV, useMMKV, useMMKVString } from 'react-native-mmkv';

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
  const [appState, setAppState] = useState(AppState.currentState);
  const [error, setError] = useState<any>();
  const [responseData, setResponseData] = useState<any>();
  const [storedData, setStoradData] = useMMKVString(key);

  useEffect(() => {
    if (!responseData) return;
    try {
      console.log('responseData!!!', responseData);
      const data2 = JSON.stringify(responseData);
      setStoradData(data2);
    } catch (e) {
      console.log('useEffect eerror', e);
      throw e;
    }
  }, [responseData, setStoradData]);

  const { environment, addRequestOnCache } = useCache(key, options);

  const fetchData = useCallback(async () => {
    console.log('fetchData');
    try {
      addRequestOnCache();
      if (environment === Environment.CACHE) return;
      const response = await requestFn();
      if (JSON.stringify(response) !== JSON.stringify(responseData)) {
        console.log('response', response);
        console.log('JSON.stringify(response)', JSON.stringify(response));
        setResponseData(response);
      }
    } catch (e) {
      console.log('fetchData ERROR', e);
      if (JSON.stringify(e) !== JSON.stringify(error)) {
        setError(e);
      }
      throw e;
    }
  }, [addRequestOnCache, environment, error, requestFn, responseData]);

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
    data: JSON.parse(storedData),
    error: responseData ? null : error,
    refetch: fetchData,
  };
}
