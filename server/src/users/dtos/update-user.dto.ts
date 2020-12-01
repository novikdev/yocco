import { ApiProperty } from '@nestjs/swagger';
import { InstagramAccount } from '../../instagram-accounts/models/instagram-account.model';

export class UpdateUserDto {
  @ApiProperty()
  readonly defaultInstagramAccountId: InstagramAccount['id'];
}
