import { InstagramAccount } from '../../instagram-accounts/models/instagram-account.model';
import { User } from '../user.model';

export class UserDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  defaultInstagramAccount?: Pick<InstagramAccount, 'id' | 'username' | 'profilePicture'>;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.surname = user.surname;
    const defaultinstagramAccount = user.instagramAccounts[0];
    if (defaultinstagramAccount) {
      this.defaultInstagramAccount = {
        id: defaultinstagramAccount.id,
        username: defaultinstagramAccount.username,
        profilePicture: defaultinstagramAccount.profilePicture,
      };
    }
  }
}
