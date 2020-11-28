import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  exports: [FacebookService],
  providers: [FacebookService],
  controllers: [FacebookController],
})
export class FacebookModule {}
