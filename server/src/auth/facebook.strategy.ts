import { Request } from 'express';
import { Strategy, Profile } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Done } from './auth.types';
import { AppConfigService } from '@common/modules/config';

const scopes = [
  'email',
  'pages_show_list', // для получения спсика страниц доступных fb пользователю (GET /{fb-user-id}/pages)
  'pages_read_engagement',
  'instagram_basic', // для получения подписчиков (GET /{ig-account-id})
  'instagram_manage_insights', // для получения количества новых подписчиков (GET /{ig-account-id}/insights)
  'ads_management', // для получения количества новых подписчиков, если доступ к странице предоставлен через Бизнес-менеджер (GET /{ig-account-id}/insights)
  'business_management', // для получения количества новых подписчиков, если доступ к странице предоставлен через Бизнес-менеджер (GET /{ig-account-id}/insights)
];

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {
    super({
      clientID: configService.fbAppId,
      clientSecret: configService.fbAppSecret,
      callbackURL: `${configService.publicHostname}/auth/facebook/callback`,
      scope: scopes.join(','),
      profileFields: ['emails', 'name'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Done,
  ): Promise<void> {
    try {
      const deviceId = this.authService.getDeviceIdFromRequest(req);
      const notGrantedPermissions = await this.authService.getNotGrantedPermissions(
        profile.id,
        accessToken,
      );
      if (notGrantedPermissions.length > 0) {
        done(
          new UnauthorizedException({
            code: 1,
            error: 'YoccoError',
            info: notGrantedPermissions,
          }),
        );
      }

      const jwt: string = await this.authService.finishUserAuth(profile, accessToken, deviceId);
      const user = {
        jwt,
      };

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
