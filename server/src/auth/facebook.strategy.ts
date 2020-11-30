import { Request } from 'express';
import { Strategy, Profile } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Done } from './auth.types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      scope: 'email,pages_show_list,pages_read_engagement',
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
      const jwt: string = await this.authService.validateFacebookLogin(
        profile,
        accessToken,
        deviceId,
      );
      const user = {
        jwt,
      };

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
