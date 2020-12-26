import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    // TODO: add config validations (https://docs.nestjs.com/techniques/configuration#schema-validation)
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '../../../../../deploy/.env.api'),
    }),
  ],
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
