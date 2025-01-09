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
  },
  key: string,
  requestFn: () => Promise<T>
) {
  const handleBackgroundRequests = async () => {
    // await delay(5000);

    // Verifica se já existe uma requisição pendente para a chave
    if (backgroundFetchsOberver.has(key)) {
      return backgroundFetchsOberver.get(key);
    }
    backgroundFetchsOberver.startPosition(key);

    // Caso contrário, inicia uma nova requisição
    const requestPromise = await handleCurrentFetch().then((res) => {
      console.log('requestPromise: ', res);
      return res;
    });

    // Armazena a Promise no mapa para reutilização
    backgroundFetchsOberver.set(key, requestPromise);

    return requestPromise;
  };

  const handleCurrentFetch = async () => {
    console.log('Starting request for', key);

    try {
      // Executa a função de requisição
      const result = await requestFn();
      console.log('Request completed for', key);
      return result;
    } catch (e) {
      console.log('Error during fetch for', key, e);
      throw e;
    } finally {
      // Remove a chave do mapa após a conclusão ou erro
      backgroundFetchsOberver.del(key);
      console.log(
        'Request completed and removed from pendingRequestsMap for',
        key
      );
    }
  };

  return { fetcher: handleBackgroundRequests };
}
