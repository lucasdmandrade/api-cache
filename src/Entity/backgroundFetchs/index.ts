import { useCallback, useEffect, useState } from 'react';

const pendingRequestsMap: Map<string, Awaited<any>> = new Map();

export function useBackgroundFetchsOberver<T>(
  key: string,
  sync: (value?: T) => void
) {
  const [pendingRequests, setPendingRequestsMap] =
    useState<Map<string, Awaited<T>>>(pendingRequestsMap);
  console.log('createMapObserver');

  const update = useCallback(() => {
    if (pendingRequests.get(key)) sync(pendingRequests.get(key));
  }, [key, pendingRequests, sync]);

  useEffect(() => {
    setPendingRequestsMap(pendingRequestsMap);
    console.log('UPDATEDDDDDDDDDDDD', pendingRequests.get(key));
    update();
  }, [key, pendingRequests, update]);

  const has = (key: string) => {
    console.log('useBackgroundFetchsOberver get', pendingRequests.get(key));
    return pendingRequests.has(key);
  };

  const get = (key: string) => {
    setPendingRequestsMap(pendingRequestsMap);
    console.log('useBackgroundFetchsOberver get', pendingRequests.get(key));
    return pendingRequests.get(key) as T;
  };

  const set = (key: string, value?: T) => {
    if (!value) return;

    setPendingRequestsMap(pendingRequestsMap);
    console.log('useBackgroundFetchsOberver set', key, value);
    pendingRequestsMap.set(key, value);
    setPendingRequestsMap(pendingRequestsMap);
  };

  const startPosition = (key: string) => {
    setPendingRequestsMap(pendingRequestsMap);

    console.log('STARTEDDDD', pendingRequests.has(key));
    if (pendingRequests.has(key)) return;

    console.log('useBackgroundFetchsOberver startPosition', key);
    pendingRequestsMap.set(key, '');
    setPendingRequestsMap(pendingRequestsMap);
  };
  const del = (key: string) => {
    setPendingRequestsMap(pendingRequestsMap);
    pendingRequestsMap.delete(key);
    setPendingRequestsMap(pendingRequestsMap);
  };

  return { has, set, del, get, startPosition };
}
