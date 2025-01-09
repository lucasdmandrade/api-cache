import React, { createContext, useContext, useState, useEffect } from 'react';

interface BackgroundFetchContextType<T> {
  pendingRequests: Map<string, Awaited<T>>;
  set: (key: string, value: T) => void;
  get: (key: string) => T | undefined;
  has: (key: string) => boolean;
  startPosition: (key: string) => void;
  del: (key: string) => void;
}

const BackgroundFetchContext = createContext<
  BackgroundFetchContextType<any> | undefined
>(undefined);

interface BackgroundFetchProviderProps {
  children: React.ReactNode;
}

export const BackgroundFetchProvider = <T extends any>({
  children,
}: BackgroundFetchProviderProps) => {
  const [pendingRequests, setPendingRequestsMap] = useState<
    Map<string, Awaited<T>>
  >(new Map());

  // Função para atualizar o valor de uma chave no Map
  const set = (key: string, value: T) => {
    setPendingRequestsMap((prevMap) => new Map(prevMap.set(key, value)));
  };

  // Função para obter o valor de uma chave
  const get = (key: string) => {
    return pendingRequests.get(key);
  };

  // Função para verificar se uma chave existe
  const has = (key: string) => {
    return pendingRequests.has(key);
  };

  // Função para inicializar uma chave
  const startPosition = (key: string) => {
    if (!pendingRequests.has(key)) {
      set(key, '');
    }
  };

  // Função para deletar uma chave
  const del = (key: string) => {
    setPendingRequestsMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  };

  return (
    <BackgroundFetchContext.Provider
      value={{ pendingRequests, set, get, has, startPosition, del }}
    >
      {children}
    </BackgroundFetchContext.Provider>
  );
};

// 4. Hook para usar o Contexto
export const useBackgroundFetchsObserver = <T extends any>(
  key: string,
  sync: (value?: T) => void
) => {
  const context = useContext(BackgroundFetchContext);

  if (!context) {
    throw new Error(
      'useBackgroundFetchsObserver must be used within a BackgroundFetchProvider'
    );
  }

  const { pendingRequests, set, get, has, startPosition, del } = context;

  // Atualiza o valor sempre que mudar
  useEffect(() => {
    if (pendingRequests.has(key)) {
      sync(pendingRequests.get(key));
    }
  }, [key, pendingRequests, sync]);

  return { pendingRequests, set, get, has, startPosition, del };
};
