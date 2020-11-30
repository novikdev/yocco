import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { FacebookModule } from '../facebook/facebook.module';
import { ConfigModule } from '@nestjs/config';
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
    UsersModule,
    PassportModule,
    FacebookModule,
    InstagramAccountsModule,
    ConfigModule,
  ],
  providers: [AuthService, FacebookStrategy, JwtStrategy],
})
export class AuthModule {}
