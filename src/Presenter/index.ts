import type { CacheOptions } from '../Entity';

/**
 * Cria um presenter para carregar dados do interactor.
 * @param {{ fetchData: (key: string, requestFn: () => Promise<any>, options?: CacheOptions) => Promise<any> }} interactor - Interactor responsável por lógica de cache.
 * @returns {{ loadData: (key: string, requestFn: () => Promise<any>, options: CacheOptions, onSuccess: (data: any) => void, onError: (error: any) => void) => Promise<void> }}
 */
export function createDataPresenter(
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
      console.log('loadData', key, requestFn, options);
      const teste = await fetchData(key, requestFn, options);

      onSuccess(teste);
    } catch (error) {
      onError(error);
    }
  };
  return { loadData };
}
