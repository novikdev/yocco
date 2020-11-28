import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Facebook } from 'fb';
import { IAccessTokenResponse } from './facebook.interfaces';

@Injectable()
export class FacebookService {
  private fb: Facebook;

  constructor(private configService: ConfigService) {
    this.fb = new Facebook({
      // TODO: fix `Forbidden non-null assertion`
      appId: configService.get<string>('FACEBOOK_APP_ID')!,
      appSecret: configService.get<string>('FACEBOOK_APP_SECRET')!,
      version: 'v8.0',
      Promise: global.Promise,
    });
  }

  public async getLongLivedAccessToken(accessToken: string) {
    try {
      const res = await this.fb.api<IAccessTokenResponse>('oauth/access_token', {
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
}
