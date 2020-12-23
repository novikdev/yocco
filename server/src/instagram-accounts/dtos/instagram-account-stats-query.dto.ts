import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class IgAccountStatsQueryDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  from: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  to: string;
}
