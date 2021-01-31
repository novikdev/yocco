import { LoadingStatus } from '@data/types';
import { createSlice } from '@reduxjs/toolkit';
import { IHourIgAccountStats } from '@services/api/instagram-accounts';
import { format } from 'date-fns';

import { addIgAccountStats, setIgAccountStats } from './actions';

export type IgAccountStatsState = {
  igAccountId: string | null;
  status: LoadingStatus;
  allDates: string[];
  byDates: {
    [day: string]: {
      delta: number;
      hours: IHourIgAccountStats[];
    };
  };
};

const initialState: IgAccountStatsState = {
  status: LoadingStatus.Idle,
  igAccountId: null,
  allDates: [],
  byDates: {},
};

export const igAccountStatsReducer = createSlice({
  name: 'igAccountStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setIgAccountStats, (state, { payload }) => ({
      ...state,
      ...payload,
    }));
    builder.addCase(addIgAccountStats, (state, { payload }) => {
      const newByDates = payload.reduce<IgAccountStatsState['byDates']>((acc, hourStats) => {
        const day = format(new Date(hourStats.datetime), 'yyyy-MM-dd');
        return {
          ...acc,
          [day]: {
            delta: (acc[day]?.delta ?? 0) + hourStats.deltaFollowersCount,
            hours: (acc[day]?.hours ?? []).concat(hourStats),
          },
        };
      }, {});

      const byDates = { ...state.byDates, ...newByDates };
      const newAllDates = Object.keys(byDates);
      const allDates = newAllDates.sort((a, b) => +new Date(b) - +new Date(a));

      return {
        ...state,
        status: LoadingStatus.Success,
        allDates,
        byDates,
      };
    });
  },
});
