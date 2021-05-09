import { IHourIgAccountStats } from '@services/api/instagram-accounts';

export function prepareStatsForDisplaying(stats: IHourIgAccountStats): IHourIgAccountStats {
  let followsCount = null;
  let unfollowsCount = null;
  if (stats.unfollowsCount && stats.followsCount) {
    const returnedFollowersCount = stats.unfollowsCount < 0 ? stats.unfollowsCount * -1 : 0;
    unfollowsCount = stats.unfollowsCount + returnedFollowersCount;
    followsCount = stats.followsCount + returnedFollowersCount;
  }
  return {
    ...stats,
    followsCount,
    unfollowsCount,
  };
}
