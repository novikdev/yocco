import { User } from '@data/init/types';
import { config } from '@services/config';
import { api } from '../api';

export class Auth {
  public static getFacebookAuthPageUrl(): string {
    return config.API_URL + '/auth/facebook';
  }

  public static async finishFacebookAuth(url: string): Promise<{ jwt: string }> {
    const response = await api.get<{ jwt: string }>(url);
    return response.data;
  }

  public static async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
}
