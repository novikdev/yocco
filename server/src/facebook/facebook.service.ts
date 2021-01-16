import { AppConfigService } from '@common/modules/config';
import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Facebook } from 'fb';
import {
  IFbPage,
  FbPaginated,
  IFbUserAccessTokenResponse,
  IFbIgAccount,
  IIgAccount,
  IIgAccountMetric,
  IIgAccountMetricValue,
  IFbPermission,
} from './facebook.types';

@Injectable()
export class FacebookService {
  private fb: Facebook;

  private readonly logger = new Logger(FacebookService.name);

  constructor(private configService: AppConfigService) {
    this.fb = new Facebook({
      appId: configService.fbAppId,
      appSecret: configService.fbAppSecret,
      version: 'v8.0',
      Promise: global.Promise,
    });
  }

  private isLastPage(res: FbPaginated<any>): boolean {
    return !res.hasOwnProperty('paging') || !res.paging.hasOwnProperty('next');
  }

  // helper recoursive function for getRestPages
  private async getNextPages<T>(nextUrl: string, data: T[]): Promise<T[]> {
    const url = new URL(nextUrl);
    const res = await this.fb.api<FbPaginated<T>>(url.pathname, url.search);
    if (!this.isLastPage(res)) {
      return await this.getNextPages(res.paging.next!, data.concat(res.data));
    } else {
      return data.concat(res.data);
    }
  }

  // get rest pages data
  private async getRestPages<T>(nextUrl: string, data: T[]): Promise<T[]> {
    return this.getNextPages(nextUrl, data);
  }

  public async getLongLivedAccessToken(accessToken: string) {
    try {
      const res = await this.fb.api<IFbUserAccessTokenResponse>('oauth/access_token', {
        client_id: this.configService.fbAppId,
        client_secret: this.configService.fbAppSecret,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: accessToken,
      });
      return res.access_token;
    } catch (error) {
      throw new Error("Couldn't get long live access tocken: " + error.message);
    }
  }

  public async getUserPages(facebookUserId: string, accessToken: string): Promise<IFbPage[]> {
    try {
      const fb = this.fb.withAccessToken(accessToken);
      const fbRes = await fb.api<FbPaginated<IFbPage>>(`/${facebookUserId}/accounts`, {
        fields: 'id,name,access_token,instagram_business_account',
      });

      const pages = this.isLastPage(fbRes)
        ? fbRes.data
        : await this.getRestPages(fbRes.paging.next!, fbRes.data);

      return pages;
    } catch (err) {
      throw new Error("Couldn't fetch user's facebook pages: " + err.message);
    }
  }

  public async getPageInstagramAccounts(
    facebookPageId: string,
    accessToken: string,
  ): Promise<IFbIgAccount[]> {
    try {
      const fb = this.fb.withAccessToken(accessToken);
      const fbRes = await fb.api<FbPaginated<IFbIgAccount>>(
        `/${facebookPageId}/instagram_accounts`,
        {
          fields: 'id,profile_pic,username',
        },
      );
      const accounts = this.isLastPage(fbRes)
        ? fbRes.data
        : await this.getRestPages(fbRes.paging.next!, fbRes.data);

      return accounts;
    } catch (err) {
      throw new Error("Couldn't fetch page's instagram accounts: " + err.message);
    }
  }

  public async getAllUserInstagramAccounts(
    facebookUserId: string,
    accessToken: string,
  ): Promise<IIgAccount[]> {
    try {
      const pages = await this.getUserPages(facebookUserId, accessToken);
      let accounts: IIgAccount[] = [];
      for (const page of pages) {
        if (!page.instagram_business_account) {
          continue;
        }

        const pageAccounts = await this.getPageInstagramAccounts(page.id, page.access_token);

        accounts = accounts.concat(
          pageAccounts.map(
            (pageAccount): IIgAccount => ({
              fbIgAccountId: pageAccount.id,
              // TODO: why do we need use ! here?
              fbIgBusinessAccountId: page.instagram_business_account!.id,
              username: pageAccount.username,
              profilePicture: pageAccount.profile_pic,
              fbAccessToken: page.access_token,
            }),
          ),
        );
      }
      return accounts;
    } catch (err) {
      throw new Error("Couldn't fetch all user's instagram accounts: " + err.message);
    }
  }

  public async getIgAccountFollowersCount(
    igBusinessAccountId: number,
    accessToken: string,
  ): Promise<number> {
    try {
      const fb = this.fb.withAccessToken(accessToken);
      const fbRes = await fb.api<{ followed_by_count: number }>(`/${igBusinessAccountId}`, {
        fields: 'followed_by_count',
      });
      return fbRes.followed_by_count;
    } catch (err) {
      throw new Error(
        `Couldn't fetch ig account (${igBusinessAccountId}) followers count: ` + err.message,
      );
    }
  }

  public async getIgAccountNewDayFollowersCount(
    igBusinessAccountId: number,
    accessToken: string,
  ): Promise<IIgAccountMetricValue> {
    try {
      const fb = this.fb.withAccessToken(accessToken);
      const fbRes = await fb.api<FbPaginated<IIgAccountMetric>>(
        `/${igBusinessAccountId}/insights`,
        {
          metric: 'follower_count',
          period: 'day',
        },
      );
      return fbRes.data[0].values[1];
    } catch (err) {
      throw new Error(
        `Couldn't fetch ig account (${igBusinessAccountId}) followers count: ` + err.message,
      );
    }
  }

  sendBtach(body: {
    batch: any[];
    access_token: string;
    include_headers?: boolean;
  }): Promise<any[]> {
    try {
      return this.fb.api('', 'post', body);
    } catch (err) {
      throw new Error(`Couldn't send batch request to FB: ` + err.message);
    }
  }

  public async getPermissions(fbUserId: string, accessToken: string): Promise<IFbPermission[]> {
    try {
      this.logger.debug(`
        ===> getPermissions
          fbUserId: ${fbUserId}
      `);
      const fb = this.fb.withAccessToken(accessToken);
      const fbRes = await fb.api<FbPaginated<IFbPermission>>(`${fbUserId}/permissions`);
      const permissions = this.isLastPage(fbRes)
        ? fbRes.data
        : await this.getRestPages(fbRes.paging.next!, fbRes.data);
      this.logger.debug(`
          permissions: ${JSON.stringify(permissions)}
      `);
      return permissions;
    } catch (err) {
      throw new Error(`Couldn't get fb user (${fbUserId}) permissions: ` + err.message);
    }
  }
}
