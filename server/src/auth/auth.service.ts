import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Profile } from 'passport-facebook';
import { Request } from 'express';

import { UsersService } from '../users/users.service';
import { FacebookService } from '../facebook/facebook.service';
import { InstagramAccountsService } from '../instagram-accounts/instagram-accounts.service';
import { AuthToken } from './auth-token.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppConfigService } from '@common/modules/config';
import { Logger } from '@nestjs/common';
import { FbPermission, FbPermissionStatus } from '../facebook/facebook.types';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  private JWT_SECRET_KEY: string;

  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(AuthToken)
    private readonly authTokenModel: typeof AuthToken,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => FacebookService))
    private readonly fbService: FacebookService,
    private readonly igAccountsService: InstagramAccountsService,
    private readonly configService: AppConfigService,
  ) {
    this.JWT_SECRET_KEY = configService.jwtSecretKey;
  }

  getDeviceIdFromRequest(req: Request): string | undefined {
    return req.header('Device-ID');
  }

  async getNotGrantedPermissions(fbUserId: string, accessToken: string): Promise<FbPermission[]> {
    this.logger.debug(`
      ====> getNotGrantedPermissions
        fbUserId: ${fbUserId}
    `);
    const permissions = await this.fbService.getPermissions(fbUserId, accessToken);
    const notGrantedPermissions = permissions
      .filter(({ status }) => status !== FbPermissionStatus.Granted)
      .map(({ permission }) => permission);
    this.logger.debug(`
        notGrantedPermissions: ${notGrantedPermissions}
    `);
    return notGrantedPermissions;
  }

  async finishUserAuth(profile: Profile, accessToken: string, deviceId?: string): Promise<string> {
    try {
      this.logger.debug(`
        ====> finishUserAuth
          profile: ${profile}
          deviceId: ${deviceId}
      `);
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
      }

      await this.igAccountsService.syncWithFacebook(user.id);

      const userToken = await this.authTokenModel.create({
        userId: user.id,
        deviceId,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      const payload = {
        jti: userToken.id,
        sub: userToken.userId,
        exp: Math.floor(userToken.expiresAt.getTime() / 1000),
      };

      const jwt = sign(payload, this.JWT_SECRET_KEY);

      return jwt;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Validate Facebook Login', err.message);
    }
  }

  async isDeviceIdCorrect(tokenId: number, deviceId?: string): Promise<boolean> {
    try {
      this.logger.debug(`
        ===> isDeviceIdCorrect
          tokenId: ${tokenId}
          deviceId: ${deviceId}
      `);
      const tokenInfo = await this.authTokenModel.findOne({ where: { id: tokenId } });
      const result = tokenInfo ? tokenInfo.deviceId === deviceId : false;
      this.logger.debug(`
          found token: ${JSON.stringify(tokenInfo)}
          method result: ${result}
      `);
      return result;
    } catch (err) {
      console.error('Device ID does not match the token' + err.message);
      return false;
    }
  }

  isExpired(exp: number) {
    return Date.now() >= exp * 1000;
  }

  public async logoutByTokenId(tokenId: number) {
    return this.authTokenModel.destroy({ where: { id: tokenId } });
  }

  public async logoutByUserIds(userIds: number[]) {
    return this.authTokenModel.destroy({
      where: {
        userId: {
          [Op.or]: userIds,
        },
      },
    });
  }
}
