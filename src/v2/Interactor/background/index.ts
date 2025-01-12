import { useMMKVBoolean } from 'react-native-mmkv';
import { useCallback } from 'react';

export const useBackgroundFetch = (key: string) => {
  const [isFetching, setIsFetching] = useMMKVBoolean(`background-${key}`);

  const initFetching = useCallback(() => {
    if (isFetching) return;
    setIsFetching(true);
  }, [isFetching, setIsFetching]);

  const endFetching = useCallback(() => {
    if (!isFetching) return;

    setIsFetching(false);
  }, [isFetching, setIsFetching]);

  return { isFetching, initFetching, endFetching };
};
