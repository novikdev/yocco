import { forwardRef, Module } from '@nestjs/common';
import { AppConfigModule } from '@common/modules/config';
import { FacebookService } from './facebook.service';
import { UsersModule } from '../users/users.module';
import { FacebookController } from './facebook.controller';
import { AuthModule } from '../auth/auth.module';
import { InstagramAccountsModule } from '../instagram-accounts/instagram-accounts.module';

@Module({
  imports: [AppConfigModule, UsersModule, forwardRef(() => AuthModule), InstagramAccountsModule],
  exports: [FacebookService],
  providers: [FacebookService],
  controllers: [FacebookController],
})
export class FacebookModule {}
