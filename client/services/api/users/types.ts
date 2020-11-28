import { IInstagramAccount } from '../instagram-accounts';

export interface IUser {
  id: number;
  email: string;
  name: string;
  surname: string;
  defaultInstagramAccount?: Pick<IInstagramAccount, 'id' | 'username' | 'profilePicture'>;
}

export interface IUpdateUser {
  defaultInstagramAccountId: IInstagramAccount['id'];
}
