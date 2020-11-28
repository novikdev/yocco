import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Facebook } from 'fb';
import {
  IFbPage,
  FbPaginated,
  IFbUserAccessTokenResponse,
  IFbIgAccount,
  IIgAccount,
} from './facebook.interfaces';

@Injectable()
export class FacebookService {
  private fb: Facebook;

  constructor(private configService: ConfigService) {
    this.fb = new Facebook({
      // TODO: fix `Forbidden non-null assertion`
      appId: configService.get<string>('FACEBOOK_APP_ID')!,
      appSecret: configService.get<string>('FACEBOOK_APP_SECRET')!,
      version: 'v9.0',
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
        client_id: this.configService.get<string>('FACEBOOK_APP_ID'),
        client_secret: this.configService.get<string>('FACEBOOK_APP_SECRET'),
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
        fields: 'id,name,access_token',
      });

      const pages = this.isLastPage(fbRes)
        ? fbRes.data
        : await this.getRestPages(fbRes.paging.next!, fbRes.data);

      return pages;
    } catch (err) {
      throw new Error("Couldn't fetch user's facebook pages" + err.message);
    }
  }

  public async getPageInstagramAccounts(
    facebookPageId: string,
    accessToken: string,
  ): Promise<IIgAccount[]> {
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

      return accounts.map((pageAccount) => ({
        facebookId: pageAccount.id,
        username: pageAccount.username,
        profilePicture: pageAccount.profile_pic,
        facebookAccessToken: accessToken,
      }));
    } catch (err) {
      throw new Error("Couldn't fetch page's instagram accounts" + err.message);
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
        const pageAccounts = await this.getPageInstagramAccounts(page.id, page.access_token);
        accounts = accounts.concat(pageAccounts);
      }
      return accounts;
    } catch (err) {
      throw new Error("Couldn't fetch all user's instagram accounts" + err.message);
    }
  }
}
