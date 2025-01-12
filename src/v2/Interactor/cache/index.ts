import { useMMKVString } from 'react-native-mmkv';
import type { CacheOptions } from '../../Entity/storage/types';
import type { StoragedFetch } from './types';
import { useCallback, useEffect, useState } from 'react';

export enum Environment {
  API = 'API',
  CACHE = 'CACHE',
}

export const useCache = (key: string, options: CacheOptions) => {
  const [cachedData, setCachedData] = useMMKVString('storagedFetchs');
  const [environment, setEnvironment] = useState(Environment.API);

  const findCurrentRequest = useCallback(() => {
    if (!cachedData) return;

    const parsedData: StoragedFetch[] = cachedData
      ? JSON.parse(cachedData)
      : [];

    console.log('parsedData', parsedData);

    const currentRequestIndex = parsedData?.findIndex(
      (request) => request.key === key
    );

    if (currentRequestIndex === -1) return;

    return parsedData.at(currentRequestIndex);
  }, [cachedData, key]);

  const handleEnvironment = useCallback(() => {
    const { staleTime = 60000 } = options;

    const parsedData: StoragedFetch[] = cachedData
      ? [JSON.parse(cachedData)]
      : [];

    console.log('parsedData', parsedData);

    const currentRequestIndex = parsedData?.findIndex(
      (request) => request.key === key
    );

    const currentRequest = parsedData.at(currentRequestIndex);

    if (Date.now() - currentRequest?.timestamp < staleTime) {
      setEnvironment(Environment.CACHE);
    }
  }, [cachedData, key, options]);

  const addRequestOnCache = useCallback(() => {
    const currentRequest = findCurrentRequest();
    if (!currentRequest) return;

    const request = {
      key,
      timestamp: Date.now(),
    };

    setCachedData((prev) => {
      console.log('prev', prev);
      return JSON.stringify([...JSON.parse(prev), request]);
    });
  }, [findCurrentRequest, key, setCachedData]);

  useEffect(() => {
    handleEnvironment();
  }, [handleEnvironment]);

  return { environment, addRequestOnCache };
};
