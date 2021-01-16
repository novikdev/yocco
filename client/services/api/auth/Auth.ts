import { config } from '@services/config';
import { YoccoError } from '@services/error';
import { api, isYoccoError } from '../api';
export class Auth {
  private static baseUrl = '/auth';

  public static getFacebookAuthPageUrl(): string {
    return `${config.API_URL}${Auth.baseUrl}/facebook`;
  }

  public static async finishFacebookAuth(url: string): Promise<{ jwt: string } | any> {
    try {
      const response = await api.get<{ jwt: string }>(url);
      return response.data;
    } catch (err) {
      if (isYoccoError(err)) {
        throw new YoccoError(err.response.data);
      }
      throw new Error();
    }
  }

  public static async logout(): Promise<void> {
    await api.get<void>(`${Auth.baseUrl}/logout`);
  }
}
