import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from './auth.types';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, jwtPayload: JwtPayload, done: VerifiedCallback) {
    try {
      const isUserActive = await this.usersService.isUserActive(jwtPayload.sub);
      if (!isUserActive) {
        throw new Error('user not found');
      }

      const deviceId = this.authService.getDeviceIdFromRequest(req);

      const isDeviceIdCorrect = this.authService.isDeviceIdCorrect(jwtPayload.jti, deviceId);
      if (!isDeviceIdCorrect) {
        throw new Error('device id and jwt are not matched');
      }

      if (!deviceId && this.authService.isExpired(jwtPayload.exp)) {
        throw new Error('token is expired');
      }

      return done(null, { id: jwtPayload.sub, tokenId: jwtPayload.jti });
    } catch (err) {
      return done(new UnauthorizedException('unauthorized', err.message), false);
    }
  }
}
