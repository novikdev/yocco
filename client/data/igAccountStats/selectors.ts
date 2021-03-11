import { AppState } from '@data/reducer';
import { LoadingStatus } from '@data/types';
import { createSelector } from '@reduxjs/toolkit';
import { IHourIgAccountStats } from '@services/api/instagram-accounts';
import { igAccountStatsReducer } from './reducer';

const selectIgAccountStatsRoot = (state: AppState) => state[igAccountStatsReducer.name];

export type Range = {
  from?: string;
  to?: string;
};

export const selectIgAccountStatsStatus = createSelector(
  selectIgAccountStatsRoot,
  (stats): LoadingStatus => stats.status
);

export const selectLoadedStatsIgAccountId = createSelector(
  selectIgAccountStatsRoot,
  (stats): string | null => stats.igAccountId
);

export const selectLoadedStatsRange = createSelector(
  selectIgAccountStatsRoot,
  (stats): Range => ({
    from: stats.allDates.slice(-1)[0],
    to: stats.allDates[0],
  })
);

export const selectIgAccountStats = createSelector(
  selectIgAccountStatsRoot,
  ({ allDates, byDates }) =>
    allDates.map((date) => ({
      day: {
        date: date,
        delta: byDates[date].delta,
      },
      data: byDates[date].hours,
    }))
);

export const selectIgAccountTempStats = createSelector(
  selectIgAccountStatsRoot,
  (stats): IHourIgAccountStats | null => stats.tempStats
);
