import { LoadingStatus } from '@data/types';
import { IHourIgAccountStats } from '@services/api/instagram-accounts';
import { IgAccountStatsState } from '../reducer';

export const mockStats: IHourIgAccountStats[] = [
  {
    datetime: '2020-12-12T19:19:00.717Z',
    followsCount: 2,
    unfollowsCount: 1,
    deltaFollowersCount: 1,
    totalFollowersCount: 106,
  },
  {
    datetime: '2020-12-12T19:20:00.756Z',
    followsCount: 5,
    unfollowsCount: 0,
    deltaFollowersCount: 5,
    totalFollowersCount: 105,
  },
  {
    datetime: '2020-12-12T21:00:00.819Z',
    followsCount: 0,
    unfollowsCount: 0,
    deltaFollowersCount: 0,
    totalFollowersCount: 100,
  },
  {
    datetime: '2020-12-13T15:00:01.205Z',
    followsCount: 5,
    unfollowsCount: 1,
    deltaFollowersCount: 4,
    totalFollowersCount: 100,
  },
];

export const successState: IgAccountStatsState = {
  status: LoadingStatus.Success,
  igAccountId: 22,
  allDates: ['2020-12-13'],
  byDates: {
    '2020-12-13': {
      delta: 4,
      hours: [
        {
          datetime: '2020-12-13T15:00:01.205Z',
          followsCount: 5,
          unfollowsCount: 1,
          deltaFollowersCount: 4,
          totalFollowersCount: 100,
        },
      ],
    },
  },
};

export const loadingState: IgAccountStatsState = {
  status: LoadingStatus.Loading,
  igAccountId: 22,
  allDates: [],
  byDates: {},
};

export const expectetState: IgAccountStatsState = {
  status: LoadingStatus.Success,
  igAccountId: 22,
  allDates: ['2020-12-13', '2020-12-12'],
  byDates: {
    '2020-12-12': {
      delta: 6,
      hours: [
        {
          datetime: '2020-12-12T19:19:00.717Z',
          followsCount: 2,
          unfollowsCount: 1,
          deltaFollowersCount: 1,
          totalFollowersCount: 106,
        },
        {
          datetime: '2020-12-12T19:20:00.756Z',
          followsCount: 5,
          unfollowsCount: 0,
          deltaFollowersCount: 5,
          totalFollowersCount: 105,
        },
      ],
    },
    '2020-12-13': {
      delta: 4,
      hours: [
        {
          datetime: '2020-12-12T21:00:00.819Z',
          followsCount: 0,
          unfollowsCount: 0,
          deltaFollowersCount: 0,
          totalFollowersCount: 100,
        },
        {
          datetime: '2020-12-13T15:00:01.205Z',
          followsCount: 5,
          unfollowsCount: 1,
          deltaFollowersCount: 4,
          totalFollowersCount: 100,
        },
      ],
    },
  },
};
