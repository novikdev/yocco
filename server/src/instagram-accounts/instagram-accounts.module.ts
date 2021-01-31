import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FacebookModule } from '../facebook/facebook.module';
import { UsersModule } from '../users/users.module';
import { InstagramAccount } from './models/instagram-account.model';
import { InstagramAccountsController } from './instagram-accounts.controller';
import { InstagramAccountsService } from './instagram-accounts.service';
import { UserInstagramAccount } from './models/user-instagram-account.model';
import { IgAccountHourStats } from './models/ig-account-hour-stats.model';

@Module({
  imports: [
    SequelizeModule.forFeature([InstagramAccount, UserInstagramAccount, IgAccountHourStats]),
    forwardRef(() => FacebookModule),
    UsersModule,
  ],
  exports: [InstagramAccountsService],
  controllers: [InstagramAccountsController],
  providers: [InstagramAccountsService],
})
export class InstagramAccountsModule {}
