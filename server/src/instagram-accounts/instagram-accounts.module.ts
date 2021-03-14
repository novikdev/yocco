import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FacebookModule } from '../facebook/facebook.module';
import { UsersModule } from '../users/users.module';
import { InstagramAccount } from './models/instagram-account.model';
import { InstagramAccountsController } from './instagram-accounts.controller';
import { InstagramAccountsService } from './instagram-accounts.service';
import { UserInstagramAccount } from './models/user-instagram-account.model';
import { IgAccountHourStats } from './models/ig-account-hour-stats.model';
import { AppConfigModule } from '@common/modules/config';

@Module({
  imports: [
    SequelizeModule.forFeature([InstagramAccount, UserInstagramAccount, IgAccountHourStats]),
    forwardRef(() => FacebookModule),
    UsersModule,
    AppConfigModule,
    CacheModule.register(),
  ],
  exports: [InstagramAccountsService],
  controllers: [InstagramAccountsController],
  providers: [InstagramAccountsService],
})
export class InstagramAccountsModule {}
