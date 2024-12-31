/**
 * Cria um sistema de armazenamento em cache na memória.
 * @returns {{ get: (key: string) => CachedData | null, set: (key: string, value: CachedData) => void, clear: () => void }}
 */
export function createMemoryCache() {
  const store = new Map();

  return {
    get(key: string) {
      return store.get(key) || null;
    },
    set(key: string, value: any) {
      store.set(key, value);
    },
    clear() {
      store.clear();
    },
  };
}
