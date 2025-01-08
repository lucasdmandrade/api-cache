let pendingRequests: { key: string; request: () => {} }[] = [];

/**
 * Cria um presenter para carregar dados do interactor.
 * @template T - O tipo de dado esperado pelo fetchData.
 * @param {function(string, () => Promise<T>, CacheOptions): Promise<T>} fetchData - Função do interactor responsável pela lógica de cache.
 * @returns {{ loadData: function(string, () => Promise<T>, CacheOptions, (data: T) => void, (error: any) => void): Promise<void> }}
 */
export function createBackgroundFetchsHandler<T>(
  key: string,
  requestFn: () => Promise<T>
) {
  const handleBackgroundRequests = async () => {
    console.log('pendingRequests', pendingRequests);
    console.log('handleBackgroundRequests');
    if (pendingRequests.length === 0) {
      console.log('pendingRequests.length === 0 +++++++++++++++++++');
      return handleCurrentFetch();
    }

    if (pendingRequests.some((el) => el.key === key)) {
      console.log('pendingRequests.has(key)');

      const index = pendingRequests.findIndex((el) => el.key === key);
      return pendingRequests.at(index);
    }

    return handleCurrentFetch();
  };

  const handleCurrentFetch = async () => {
    try {
      pendingRequests.push({ key, request: requestFn });
      await delay(5000);
      console.log('pendingRequests.set(key, requestFn);');
      console.log('handleCurrentFetch requestFn', requestFn);
      await requestFn();

      console.log('handleCurrentFetch SETTED');

      return requestFn;
    } catch (e) {
      console.log('handleCurrentFetch error', e);
    } finally {
      console.log('finally');
    }
  };
  return { fetcher: handleBackgroundRequests };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
