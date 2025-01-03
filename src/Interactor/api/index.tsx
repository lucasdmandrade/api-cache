import type { CacheOptions } from '../../Entity/storage/types';

/**
 * Cria um presenter para carregar dados do interactor.
 * @template T - O tipo de dado esperado pelo fetchData.
 * @param {function(string, () => Promise<T>, CacheOptions): Promise<T>} fetchData - Função do interactor responsável pela lógica de cache.
 * @returns {{ loadData: function(string, () => Promise<T>, CacheOptions, (data: T) => void, (error: any) => void): Promise<void> }}
 */
export function createFetchHandler<T>(
  fetchData: (
    key: string,
    requestFn: () => Promise<T>,
    options: CacheOptions
  ) => Promise<T>
) {
  const loadData = async (
    key: string,
    requestFn: () => Promise<T>,
    options: CacheOptions,
    onSuccess: (data: T) => void,
    onError: (error: any) => void
  ) => {
    try {
      const data = await fetchData(key, requestFn, options);
      onSuccess(data);
    } catch (error) {
      onError(error);
    }
  };

  return { loadData };
}
