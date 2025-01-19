// import { useCallback } from 'react';
// import { storage } from '../../Entity/storage';

// export const useBackgroundFetch = (key: string) => {
//   const getIsFetching = useCallback(() => {
//     const state = storage.get(`background-${key}`);

//     return state;
//   }, [key]);

//   const initFetching = useCallback(() => {
//     const state = getIsFetching();
//     if (state) return;

//     storage.set(`background-${key}`, true);
//   }, [key, getIsFetching]);

//   const endFetching = useCallback(() => {
//     const state = getIsFetching();

//     if (!state) return;

//     storage.clear(`background-${key}`);
//   }, [key, getIsFetching]);

//   return {
//     isFetching: getIsFetching,
//     initFetching,
//     endFetching,
//   };
// };
