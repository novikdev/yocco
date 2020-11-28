import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { FacebookService } from '../facebook/facebook.service';
import { InstagramAccountsService } from '../instagram-accounts/instagram-accounts.service';

@Injectable()
export class AuthService {
  private JWT_SECRET_KEY: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly fbService: FacebookService,
    private readonly igAccountsService: InstagramAccountsService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET_KEY = configService.get<string>('JWT_SECRET_KEY') ?? '';
  }

  async validateFacebookLogin(profile: Profile, accessToken: string): Promise<string> {
    try {
      const longLivedAccessToken = await this.fbService.getLongLivedAccessToken(accessToken);

      let user = await this.usersService.getByFacebookId(profile.id);

      if (user) {
        if (user.facebookAccessToken !== longLivedAccessToken) {
          await user.update({
            facebookAccessToken: longLivedAccessToken,
          });
        }
      } else {
        user = await this.usersService.create({
          email: profile.emails?.[0].value,
          name: profile.name?.givenName ?? 'User',
          surname: profile.name?.familyName ?? '',
          gender: profile.gender,
          facebookId: profile.id,
          facebookAccessToken: longLivedAccessToken,
        });

        await this.igAccountsService.syncWithFacebook(user.id);
      }

      const payload = {
        userId: user.id,
      };
      const jwt = sign(payload, this.JWT_SECRET_KEY, { expiresIn: '7 days' });
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('Validate Facebook Login', err.message);
    }
  }
}
