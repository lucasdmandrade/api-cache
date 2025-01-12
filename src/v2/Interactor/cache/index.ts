import { useMMKVString } from 'react-native-mmkv';
import type { CacheOptions } from '../../Entity/storage/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export enum Environment {
  API = 'API',
  CACHE = 'CACHE',
}

export const useCache = <T>(key: string, options: CacheOptions) => {
  const [environment, setEnvironment] = useState(Environment.API);
  const [storedData, setStoradData] = useMMKVString(key);

  const parsedData = useMemo(() => {
    if (!storedData) return undefined;
    return JSON.parse(storedData).data as T;
  }, [storedData]);

  const dataTimestammp = useMemo(() => {
    if (!storedData) return 0;
    return JSON.parse(storedData).timestamp;
  }, [storedData]);

  const storeData = useCallback(
    (data: T) => {
      const now = Date.now();
      const json = JSON.stringify({ data, timestamp: now });

      if (JSON.stringify(data) === JSON.stringify(parsedData)) return;
      setStoradData(json);
    },
    [setStoradData, parsedData]
  );

  const handleEnvironment = useCallback(() => {
    const { staleTime = 600000 } = options;

    if (Date.now() - dataTimestammp < staleTime) {
      console.log('USE CACHE');
      return setEnvironment(Environment.CACHE);
    }
    setEnvironment(Environment.API);
  }, [dataTimestammp, options]);

  useEffect(() => {
    handleEnvironment();
  }, [handleEnvironment]);

  return { data: parsedData, environment, storeData };
};
