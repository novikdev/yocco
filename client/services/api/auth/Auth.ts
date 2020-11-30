import { config } from '@services/config';
import { api } from '../api';

export class Auth {
  private static baseUrl = '/auth';

  public static getFacebookAuthPageUrl(): string {
    return `${config.API_URL}${Auth.baseUrl}/facebook`;
  }

  public static async finishFacebookAuth(url: string): Promise<{ jwt: string }> {
    const response = await api.get<{ jwt: string }>(url);
    return response.data;
  }

  public static async logout(): Promise<void> {
    await api.get<void>(`${Auth.baseUrl}/logout`);
  }
}
