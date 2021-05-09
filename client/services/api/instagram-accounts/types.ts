export interface IInstagramAccount {
  id: string;
  username: string;
  profilePicture: string;
  isDefault: boolean;
}

export interface IHourIgAccountStats {
  datetime: string;
  deltaFollowersCount: number;
  followsCount: number | null;
  unfollowsCount: number | null;
  totalFollowersCount: number;
}
