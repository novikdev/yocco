import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FbWebhookSubscribeQueryDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  'hub.mode': 'subscribe';

  @ApiProperty({
    required: true,
  })
  @IsString()
  'hub.challenge': string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  'hub.verify_token': string;
}
