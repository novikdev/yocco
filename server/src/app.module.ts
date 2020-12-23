import { FacebookModule } from './facebook/facebook.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstagramAccountsModule } from './instagram-accounts/instagram-accounts.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // TODO: add config validations (https://docs.nestjs.com/techniques/configuration#schema-validation)
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isLoggingEnabled = configService.get<string>('DB_LOGGER_ENABLED') === 'true';
        return {
          dialect: 'postgres',
          host: 'localhost',
          port: 5432,
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          autoLoadModels: true,
          define: {
            underscored: true,
          },
          synchronize: true,
          logging: isLoggingEnabled && console.log,
          logQueryParameters: isLoggingEnabled,
        };
      },
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
