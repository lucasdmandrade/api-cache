import type { CacheOptions } from '../../Entity/storage/types';

/**
 * Cria um presenter para carregar dados do interactor.
 * @template T - O tipo de dado esperado pelo fetchData.
 * @param {function(string, () => Promise<T>, CacheOptions): Promise<T>} fetchData - Função do interactor responsável pela lógica de cache.
 * @returns {{ fetcher: () =>  Awaited<T> }}
 */
export function createBackgroundFetchsHandler<T>(
  backgroundFetchsOberver: {
    has: (key: string) => boolean;
    set: (key: string, value: T) => void;
    del: (key: string) => void;
    get: (key: string) => T;
    startPosition: (key: string) => void;
  },
  key: string,
  options: CacheOptions,
  requestFn: () => Promise<T>
) {
  const handleBackgroundRequests = async () => {
    if (backgroundFetchsOberver.has(key) && backgroundFetchsOberver.get(key)) {
      console.log(
        'backgroundFetchsOberver.get(key)',
        backgroundFetchsOberver.get(key)
      );
      return backgroundFetchsOberver.get(key);
    }
    options.multiScreen && backgroundFetchsOberver.startPosition(key);

    const requestPromise = await handleCurrentFetch().then((res) => {
      console.log('requestPromise: ', res);
      return res;
    });

    if (options.multiScreen) {
      backgroundFetchsOberver.set(key, requestPromise);
    }

    return requestPromise;
  };

  const handleCurrentFetch = async () => {
    console.log('Starting request for', key);

    try {
      const result = await requestFn();
      console.log('Request completed for', key);
      return result;
    } catch (e) {
      console.log('Error during fetch for', key, e);
      throw e;
    }
  };

  return { fetcher: handleBackgroundRequests };
}
