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

      //Lembrei errado, esse tempo é para atualizar o valor de isFetching automaticamente, nn atualizar o dado na tela
    }, 500);

    return () => clearInterval(interval);
  }, [isFetching, key]);

  const setNewFetch = () => {
    backgroundFetchs.setNewFetch(key);
  };

  const removeFetch = () => {
    backgroundFetchs.removeFetch(key);
  };

  return { refreshIsFetching, setNewFetch, removeFetch, isFetching };
};
