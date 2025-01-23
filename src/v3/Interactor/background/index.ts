import { useEffect, useState } from 'react';
import * as backgroundFetchs from '../../Entity/backgroundFetchs';

export const useBackgroundFetchs = (key: string) => {
  const [isFetching, setIsFetching] = useState(false);

  const refreshIsFetching = () => {
    const state = backgroundFetchs.isFetching(key);
    setIsFetching(state);
    return state;
  };

  useEffect(() => {
    if (!isFetching) return;

    const interval = setInterval(() => {
      const currentState = backgroundFetchs.isFetching(key);

      if (!currentState) {
        setIsFetching(false);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isFetching, key]);

  const setNewFetch = () => {
    console.log('useBackgroundFetchs setNewFetch');
    backgroundFetchs.setNewFetch(key);
  };

  const removeFetch = () => {
    console.log('useBackgroundFetchs removeFetch');
    backgroundFetchs.removeFetch(key);
  };

  return { refreshIsFetching, setNewFetch, removeFetch, isFetching };
};
