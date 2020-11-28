import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacebookService } from './facebook.service';

@Module({
  imports: [ConfigModule],
  exports: [FacebookService],
  providers: [FacebookService],
})
export class FacebookModule {}
