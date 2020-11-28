import { api } from '../api';
import { IInstagramAccount } from './types';

export class InstagramAccounts {
  public static async getAll(): Promise<IInstagramAccount[]> {
    const response = await api.get<IInstagramAccount[]>('/instagram-accounts');
    return response.data;
  }
}
