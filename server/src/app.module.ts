import { FacebookModule } from './facebook/facebook.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstagramAccountsModule } from './instagram-accounts/instagram-accounts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule, AppConfigService } from '@common/modules/config';

@Module({
  imports: [
    AppConfigModule,
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
        synchronize: true,
        logging: configService.isDbLoggingEnabled && console.log,
        logQueryParameters: configService.isDbLoggingEnabled,
      }),
    }),
    AuthModule,
    UsersModule,
    FacebookModule,
    InstagramAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
