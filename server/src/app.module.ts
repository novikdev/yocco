import { FacebookModule } from './facebook/facebook.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstagramAccountsModule } from './instagram-accounts/instagram-accounts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule, AppConfigService } from '@common/modules/config';
import { LoggerModule } from '@common/modules/logger';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService, AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        dialect: 'postgres',
        ...configService.dbConfig,
        autoLoadModels: true,
        define: {
          underscored: true,
        },
        synchronize: process.env.NODE_ENV !== 'production',
        logging: configService.isDbLoggingEnabled && console.log,
        logQueryParameters: configService.isDbLoggingEnabled,
      }),
    }),
    AuthModule,
    UsersModule,
    FacebookModule,
    InstagramAccountsModule,
  ],
})
export class AppModule {}
