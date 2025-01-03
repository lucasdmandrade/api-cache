import { MMKV } from 'react-native-mmkv';

/**
 * Cria um sistema de armazenamento em cache na memória.
 * @returns {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void, clear: () => void }}
 */
export function createMemoryCache<T>() {
  const storage = new MMKV();

  return {
    get(key: string) {
      return storage.getString(key) || null;
    },
    set(key: string, value: T) {
      storage.set(key, JSON.stringify(value));
    },
    clear() {
      storage.clearAll();
    },
  };
}
