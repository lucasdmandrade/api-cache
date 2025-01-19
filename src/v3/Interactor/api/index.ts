import { useCallback } from 'react';
import type { CacheOptions } from '../../Entity/storage/types';

export const useRequest = <T>() => {
  const attemptFetch = useCallback(
    async (request: () => Promise<T>, options: CacheOptions): Promise<T> => {
      const { retries = 0, retryInterval = 1000 } = options;
      let attempt = 0;

      while (attempt <= retries) {
        attempt++;
        try {
          console.log(`Attempt ${attempt}: Trying to fetch data...`);
          const result = await request();

          return result;
        } catch (error) {
          console.error(`Error on attempt ${attempt}:`, error);

          if (attempt < retries) {
            console.log(`Retrying in ${retryInterval}ms...`);

            await new Promise((resolve) => setTimeout(resolve, retryInterval));
          } else {
            console.error('Max retries reached. Throwing error...');
            throw error;
          }
        }
      }

      throw new Error('Unexpected error in attemptFetch');
    },
    []
  );

  return { attemptFetch };
};
