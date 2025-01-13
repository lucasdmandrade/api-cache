// import { type FC, Fragment } from 'react';
// import { Text, Button } from 'react-native';
// import { render, act, screen } from '@testing-library/react-native';
// import { useQueryv2 } from '.';
// import { Environment } from '../Interactor/cache';
// import type { CacheOptions } from '../Entity/storage/types';

// jest.mock('../Interactor/cache', () => ({
//   useCache: jest.fn(),
//   Environment: {
//     CACHE: 'CACHE',
//     NETWORK: 'NETWORK',
//   },
// }));

// jest.mock('../Interactor/api', () => ({
//   useRequest: jest.fn(),
// }));

// jest.mock('../Interactor/background', () => ({
//   useBackgroundFetch: jest.fn(),
// }));

// describe('useQueryv2 (React Native)', () => {
//   let mockUseCache;
//   let mockUseRequest;
//   let mockUseBackgroundFetch;

//   beforeEach(() => {
//     mockUseCache = require('../Interactor/cache').useCache;
//     mockUseRequest = require('../Interactor/api').useRequest;
//     mockUseBackgroundFetch =
//       require('../Interactor/background').useBackgroundFetch;

//     mockUseCache.mockReturnValue({
//       environment: Environment.API,
//       storeData: jest.fn(),
//       data: null,
//     });

//     mockUseRequest.mockReturnValue({
//       attemptFetch: jest.fn(() => Promise.resolve({ result: 'success' })),
//     });

//     mockUseBackgroundFetch.mockReturnValue({
//       isFetching: false,
//       initFetching: jest.fn(),
//       endFetching: jest.fn(),
//     });
//   });

//   const TestComponent: FC<{
//     key: string;
//     requestFn: () => Promise<any>;
//     options: CacheOptions;
//   }> = ({ key, requestFn, options }) => {
//     const { data, error, refetch } = useQueryv2(key, requestFn, options);

//     return (
//       <Fragment>
//         <Text testID="data">{JSON.stringify(data)}</Text>
//         <Text testID="error">{error ? error.message : 'null'}</Text>
//         <Button title="Refetch" onPress={refetch} />
//       </Fragment>
//     );
//   };

//   it('fetches data and stores it in cache', async () => {
//     await act(async () => {
//       render(
//         <TestComponent
//           key="test-key"
//           requestFn={() => Promise.resolve({ result: 'test-data' })}
//           options={{ cacheTime: 1000 }}
//         />
//       );
//     });

//     const data = await screen.findByTestId('data');
//     const error = await screen.findByTestId('error');

//     expect(data.props.children).toBe(JSON.stringify({ result: 'success' }));
//     expect(error.props.children).toBe('null');
//   });

//   it('handles fetch error', async () => {
//     mockUseRequest.mockReturnValue({
//       attemptFetch: jest.fn(() =>
//         Promise.reject(new Error('Failed to fetch data'))
//       ),
//     });

//     await act(async () => {
//       render(
//         <TestComponent
//           key="test-key"
//           requestFn={() => Promise.reject(new Error('Failed to fetch data'))}
//           options={{
//             retries: 1,
//             retryInterval: 100,
//             staleTime: 500,
//           }}
//         />
//       );
//     });

//     const data = await screen.findByTestId('data');
//     const error = await screen.findByTestId('error');

//     expect(data.props.children).toBe('null');
//     expect(error.props.children).toBe('Failed to fetch data');
//   });
// });
