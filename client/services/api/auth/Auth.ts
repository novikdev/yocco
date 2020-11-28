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
}
