import { api } from '../api';
import { IHourIgAccountStats, IInstagramAccount } from './types';

export class InstagramAccounts {
  private static baseUrl = '/instagram-accounts';

  public static async getAll(): Promise<IInstagramAccount[]> {
    const response = await api.get<IInstagramAccount[]>(InstagramAccounts.baseUrl);
    return response.data;
  }

  public static async getAccountStats(
    accountId: IInstagramAccount['id'],
    params: { from: Date; to: Date }
  ): Promise<IHourIgAccountStats[]> {
    const response = await api.get<IHourIgAccountStats[]>(
      `${InstagramAccounts.baseUrl}/${accountId}/stats`,
      { params }
    );
    return response.data;
  }

  public static async getAccountTempStats(
    accountId: IInstagramAccount['id']
  ): Promise<IHourIgAccountStats> {
    const response = await api.get<IHourIgAccountStats>(
      `${InstagramAccounts.baseUrl}/${accountId}/temp-stats`
    );
    return response.data;
  }
}
