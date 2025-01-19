import { useQuery } from './Presenter';
import { type CacheOptions } from './Entity/storage/types';
import { BackgroundFetchProvider } from './Entity/backgroundFetchs/context';
import { useQueryv2 } from './v2/Presenter';

import { useQueryV3 } from './v3/Presenter';
import { StorageProvider } from './v3/Entity/storage';

const V3 = { useQueryV3, StorageProvider };

export { useQuery, BackgroundFetchProvider, type CacheOptions, useQueryv2, V3 };
