import { LoadingStatus } from '@data/types';

export function isLoading(status: LoadingStatus): boolean {
  return [LoadingStatus.Idle, LoadingStatus.Pending].includes(status);
}
