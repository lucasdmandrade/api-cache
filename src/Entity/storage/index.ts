import { MMKV } from 'react-native-mmkv';

/**
 * Cria um sistema de armazenamento em cache na memória.
 * @returns {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void, clear: () => void }}
 */

const instance = new MMKV();

export const storage = () => {
  const get = (key: string) => {
    return instance.getString(key) || null;
  };
  const set = (key: string, value: any) => {
    instance.set(key, JSON.stringify(value));
  };
  const clearAll = () => {
    instance.clearAll();
  };
  const clear = (key: string) => {
    instance.delete(key);
  };

  return { get, set, clear, clearAll };
};
