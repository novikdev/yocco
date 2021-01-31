import { Request } from 'express';
import { Strategy, Profile } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Done } from './auth.types';
import { AppConfigService } from '@common/modules/config';
import { FbPermission } from '../facebook/facebook.types';

export const requiredFbPermissions = [
  FbPermission.Email,
  FbPermission.PagesShowList, // для получения спсика страниц доступных fb пользователю (GET /{fb-user-id}/pages)
  FbPermission.PagesReadEngagement, // нужен для instqgram_basic
  FbPermission.InstagramBasic, // для получения подписчиков (GET /{ig-account-id})
  FbPermission.InstagramManageInsights, // для получения количества новых подписчиков (GET /{ig-account-id}/insights)
  FbPermission.AdsManagement, // для получения количества новых подписчиков, если доступ к странице предоставлен через Бизнес-менеджер (GET /{ig-account-id}/insights)
  FbPermission.BusinessManagement, // для получения количества новых подписчиков, если доступ к странице предоставлен через Бизнес-менеджер (GET /{ig-account-id}/insights)
];

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {
    super({
      graphAPIVersion: 'v8.0',
      clientID: configService.fbAppId,
      clientSecret: configService.fbAppSecret,
      callbackURL: `${configService.publicHostname}/auth/facebook/callback`,
      scope: requiredFbPermissions.join(','),
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

  // WORKAROUND: pass options to superclass auth call by overriding superclass method (see https://github.com/nestjs/passport/issues/57)
  authorizationParams(options: any): any {
    return Object.assign(options, {
      auth_type: 'rerequest',
    });
  }
}
