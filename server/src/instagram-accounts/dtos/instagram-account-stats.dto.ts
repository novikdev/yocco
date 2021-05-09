import { ApiProperty } from '@nestjs/swagger';

export class IgAccountHourStatsDto {
  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  followsCount: number | null;

  @ApiProperty()
  unfollowsCount: number | null;

  @ApiProperty()
  deltaFollowersCount: number;

  @ApiProperty()
  totalFollowersCount: number;

  constructor(stats: IgAccountHourStatsDto) {
    this.datetime = stats.datetime;
    this.followsCount = stats.followsCount;
    this.unfollowsCount = stats.unfollowsCount;
    this.deltaFollowersCount = stats.deltaFollowersCount;
    this.totalFollowersCount = stats.totalFollowersCount;
  }
}
