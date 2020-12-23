import { ApiProperty } from '@nestjs/swagger';

export class IgAccountHourStatsDto {
  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  followsCount: number;

  @ApiProperty()
  unfollowsCount: number;

  @ApiProperty()
  deltaFollowersCount: number;

  @ApiProperty()
  totalFollowersCount: number;
}
