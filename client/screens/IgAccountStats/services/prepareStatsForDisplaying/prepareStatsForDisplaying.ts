import { IHourIgAccountStats } from '@services/api/instagram-accounts';

export function prepareStatsForDisplaying(stats: IHourIgAccountStats): IHourIgAccountStats {
  const returnedFollowersCount = stats.unfollowsCount < 0 ? stats.unfollowsCount * -1 : 0;
  const unfollowsCount = stats.unfollowsCount + returnedFollowersCount;
  const followsCount = stats.followsCount + returnedFollowersCount;
  return {
    ...stats,
    followsCount,
    unfollowsCount,
  };
}
