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
  const [pendingRequests, setPendingRequestsMap] = useState<Map<string, T>>(
    new Map()
  );

  const set = (key: string, value: T) => {
    if (JSON.stringify(pendingRequests.get(key)) === JSON.stringify(value)) {
      return;
    }

    setPendingRequestsMap((prevMap) => new Map(prevMap.set(key, value)));
  };

  const get = (key: string) => {
    return pendingRequests.get(key);
  };

  const has = (key: string) => {
    return pendingRequests.has(key);
  };

  const startPosition = (key: string) => {
    if (!pendingRequests.has(key)) {
      set(key, '' as T);
    }
  };

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

  useEffect(() => {
    console.log('useEffect pendingRequests.has(key)', pendingRequests.has(key));
    if (pendingRequests.has(key)) {
      sync(pendingRequests.get(key));
    }
  }, [key, pendingRequests, sync]);

  return { pendingRequests, set, get, has, startPosition, del };
};
