import { Module } from '@nestjs/common';
import { AppConfigModule } from '@common/modules/config';
import { FacebookService } from './facebook.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AppConfigModule, UsersModule],
  exports: [FacebookService],
  providers: [FacebookService],
})
export class FacebookModule {}
