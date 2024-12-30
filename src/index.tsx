import ApiCache from './NativeApiCache';

export function multiply(a: number, b: number): number {
  return ApiCache.multiply(a, b);
}
