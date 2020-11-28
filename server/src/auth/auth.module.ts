import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { FacebookModule } from '../facebook/facebook.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, PassportModule, FacebookModule, ConfigModule],
  providers: [AuthService, FacebookStrategy, JwtStrategy],
})
export class AuthModule {}
