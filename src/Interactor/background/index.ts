const pendingRequests = new Map<string, void>();

/**
 * Cria um presenter para carregar dados do interactor.
 * @template T - O tipo de dado esperado pelo fetchData.
 * @param {function(string, () => Promise<T>, CacheOptions): Promise<T>} fetchData - Função do interactor responsável pela lógica de cache.
 * @returns {{ loadData: function(string, () => Promise<T>, CacheOptions, (data: T) => void, (error: any) => void): Promise<void> }}
 */
export function createBackgroundFetchsHandler(key: string, requestFn: void) {
  const handleBackgroundRequests = async () => {
    if (!pendingRequests.size) {
      console.log('!pendingRequests.has(key)');
      return handleCurrentFetch();
    }

    if (pendingRequests.has(key)) {
      console.log('pendingRequests.has(key)');
      return pendingRequests.get(key);
    }

    return handleCurrentFetch();
  };

  const handleCurrentFetch = () => {
    try {
      console.log('pendingRequests.set(key, requestFn);');
      pendingRequests.set(key, requestFn);

      return requestFn;
    } finally {
      pendingRequests.delete(key);
    }
  };
  return { fetcher: handleBackgroundRequests };
}
