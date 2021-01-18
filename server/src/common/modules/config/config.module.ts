import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';

const configDir = process.env.APP_DIR
  ? path.join(process.env.APP_DIR, 'config')
  : path.join(__dirname, '../../../../../deploy');

@Module({
  imports: [
    // TODO: add config validations (https://docs.nestjs.com/techniques/configuration#schema-validation)
    ConfigModule.forRoot({
      envFilePath: path.join(configDir, '.env.api'),
    }),
  ],
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
