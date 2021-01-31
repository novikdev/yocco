import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { FacebookModule } from '../facebook/facebook.module';
import { AppConfigModule } from '@common/modules/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { InstagramAccountsModule } from '../instagram-accounts/instagram-accounts.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthToken } from './auth-token.model';

@Module({
  controllers: [AuthController],
  imports: [
    SequelizeModule.forFeature([AuthToken]),
    forwardRef(() => FacebookModule),
    forwardRef(() => InstagramAccountsModule),
    UsersModule,
    PassportModule,
    AppConfigModule,
  ],
  exports: [AuthService],
  providers: [AuthService, FacebookStrategy, JwtStrategy],
})
export class AuthModule {}
