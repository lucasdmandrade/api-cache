import { useState, useEffect, useCallback } from 'react';
import type { CacheOptions, UseQueryError } from '../Entity';
import { createCacheInteractor, createMemoryCache } from '../Interactor';
import { createDataPresenter } from '../Presenter';

/**
 * Hook para buscar dados com cache.
 * @param {string} key - Chave do cache.
 * @param {() => Promise<any>} requestFn - Função para realizar a requisição.
 * @param {CacheOptions} options - Opções de cache.
 * @returns {{ data: any, error: any, isLoading: boolean }}
 */

let count = 0;
export function useQuery(
  key: string,
  requestFn: () => Promise<any>,
  options: CacheOptions
) {
  count++;
  console.log('CONUT', count);
  const [data, setData] = useState();
  const [error, setError] = useState<UseQueryError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedRequestFn = useCallback(() => {
    console.log('memoizedRequestFn called');
    return requestFn();
  }, [requestFn]);

  const fetchData = useCallback(async () => {
    console.log('fetchData!!!!!!!!');
    const cache = createMemoryCache();
    const interactor = createCacheInteractor(cache);
    const presenter = createDataPresenter(interactor.fetchData);

    console.log('aaa');

    await presenter.loadData(
      key,
      memoizedRequestFn,
      options,
      (result) => {
        console.log('result', result);
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

  return { data, error, isLoading };
}
