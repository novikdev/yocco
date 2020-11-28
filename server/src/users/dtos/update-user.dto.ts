import { InstagramAccount } from '../../instagram-accounts/models/instagram-account.model';

export class UpdateUserDto {
  readonly defaultInstagramAccountId: InstagramAccount['id'];
}
