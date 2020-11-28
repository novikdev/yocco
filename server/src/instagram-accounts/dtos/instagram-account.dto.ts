import { InstagramAccount } from '../models/instagram-account.model';
import { UserInstagramAccount } from '../models/user-instagram-account.model';

export class InstagramAccountDto {
  id: number;
  username: string;
  profilePicture: string;
  isDefault: boolean;
  constructor(igAccount: InstagramAccount & { UserInstagramAccount: UserInstagramAccount }) {
    this.id = igAccount.id;
    this.username = igAccount.username;
    this.profilePicture = igAccount.profilePicture;
    this.isDefault = igAccount.UserInstagramAccount.isDefault || false;
  }
}
