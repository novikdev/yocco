import { api } from '../api';
import { IUpdateUser, IUser } from './types';

export class Users {
  private static baseUrl = '/users';

  public static async getMe(): Promise<IUser> {
    const response = await api.get<IUser>(`${Users.baseUrl}/me`);
    return response.data;
  }

  public static async patchMe(updateUser: IUpdateUser): Promise<IUser> {
    const response = await api.patch<IUser>(`${Users.baseUrl}/me`, updateUser);
    return response.data;
  }
}
