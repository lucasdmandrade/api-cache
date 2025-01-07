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
  const attemptFetch = async (
    key: string,
    requestFn: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> => {
    const { retries = 0, retryInterval = 1000 } = options;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        console.log(`Attempt ${attempt + 1}: Trying to fetch data...`);
        const result = await fetchData(key, requestFn, options);
        return result;
      } catch (error) {
        console.error(`Error on attempt ${attempt + 1}:`, error);

        if (attempt < retries) {
          attempt++;
          console.log(`Retrying in ${retryInterval}ms...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        } else {
          console.error('Max retries reached. Throwing error...');
          throw error; // Sai do loop lançando o erro
        }
      }
    }

    // Este ponto nunca será alcançado por causa do throw e do return no loop.
    throw new Error('Unexpected error in attemptFetch');
  };

  const loadData = async (
    key: string,
    requestFn: () => Promise<T>,
    options: CacheOptions,
    onSuccess: (data: T) => void,
    onError: (error: any) => void
  ) => {
    try {
      const data = await attemptFetch(key, requestFn, options);

      console.log('loadData', data);
      onSuccess(data);
    } catch (error) {
      console.log('loadData error ', error);
      onError(error);
    }
  };

  return { fetcher: loadData, attemptFetch };
}
