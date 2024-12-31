import { MMKV } from 'react-native-mmkv';

/**
 * Cria um sistema de armazenamento em cache na memória.
 * @returns {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void, clear: () => void }}
 */
export function createMemoryCache() {
  console.log('createMemoryCache');
  const storage = new MMKV();
  console.log('storage');

  return {
    get(key: string) {
      return storage.getString(key) || null;
    },
    set(key: string, value: any) {
      storage.set(key, JSON.stringify(value));
    },
    clear() {
      storage.clearAll();
    },
  };
}
