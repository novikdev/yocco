import { IHourIgAccountStats } from '@services/api/instagram-accounts';

export function prepareStatsForDisplaying(stats: IHourIgAccountStats): IHourIgAccountStats {
  let followsCount = null;
  let unfollowsCount = null;
  if (typeof stats.unfollowsCount === 'number' && typeof stats.followsCount === 'number') {
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
