import type { CacheOptions } from '../../Entity/storage/types';

/**
 * Cria um presenter para carregar dados do interactor.
 * @param {{ (key: string, requestFn: () => Promise<any>, options?: CacheOptions) => Promise<any> }} fetchData - Interactor responsável por lógica de cache.
 * @returns {{ loadData: (key: string, requestFn: () => Promise<any>, options: CacheOptions, onSuccess: (data: any) => void, onError: (error: any) => void) => Promise<void> }}
 */
export function createFetchHandler(
  fetchData: (
    key: string,
    requestFn: () => Promise<any>,
    options: CacheOptions
  ) => Promise<any>
) {
  const loadData = async (
    key: string,
    requestFn: () => Promise<any>,
    options: CacheOptions,
    onSuccess: (data: any) => void,
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
