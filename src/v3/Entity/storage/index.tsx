import { createContext, useContext } from 'react';
import type { StorageMethods, StorageProviderProps } from './types';

const StorageContext = createContext<StorageMethods<unknown> | undefined>(
  undefined
);

export const StorageProvider = ({
  children,
  storage,
}: StorageProviderProps) => {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = <T extends any>() => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }

  return context as StorageMethods<T>;
};
