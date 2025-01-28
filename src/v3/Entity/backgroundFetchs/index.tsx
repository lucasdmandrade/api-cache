import type { BackgroundFetchs } from './types';

let backgroundFetchs: BackgroundFetchs[] = [];

const isFetching = (key: string) => {
  const currentFetch = backgroundFetchs.find((fetch) => fetch.key === key);

  return !!currentFetch;
};

const setNewFetch = (key: string) => {
  const currentFetch = backgroundFetchs.find((fetch) => fetch.key === key);

  if (currentFetch) return;

  backgroundFetchs.push({ key });
};

const removeFetch = (key: string) => {
  const currentFetch = backgroundFetchs.findIndex((fetch) => fetch.key === key);

  if (currentFetch === -1) return;

  backgroundFetchs.splice(currentFetch, 1);
};

export { isFetching, setNewFetch, removeFetch };
