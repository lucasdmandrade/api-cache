import { MMKV } from 'react-native-mmkv';

/**
 * Cria um sistema de armazenamento em cache na memória.
 * @returns {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void, clear: () => void }}
 */

const instance = new MMKV();

export const storage = {
  get: (key: string) => {
    return instance.getString(key) || null;
  },
  set: (key: string, value: any) => {
    instance.set(key, JSON.stringify(value));
  },
  clearAll: () => {
    instance.clearAll();
  },
  clear: (key: string) => {
    instance.delete(key);
  },
};
