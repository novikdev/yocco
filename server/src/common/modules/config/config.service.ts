// TODO: add validation, fix types and remove `@typescript-eslint/no-non-null-assertion` disabling
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type DbConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    const defaultPort = 3000;
    try {
      return parseInt(this.configService.get<string>('PORT') || '', 10) || defaultPort;
    } catch {
      return defaultPort;
    }
  }

  get publicHostname(): string {
    const protocol = this.configService.get<string>('PROTOCOL');
    const host = this.configService.get<string>('HOST');
    const basePath = this.configService.get<string>('BASE_PATH');

    let port = '';
    if (process.env.NODE_ENV !== 'production') {
      port = ':' + this.port;
    }
    return `${protocol}://${host}${port}${basePath}`;
  }

  get fbAppId(): string {
    return this.configService.get<string>('FACEBOOK_APP_ID')!;
  }

  get fbAppSecret(): string {
    return this.configService.get<string>('FACEBOOK_APP_SECRET')!;
  }

  get dbConfig(): DbConfig {
    return {
      host: this.configService.get<string>('POSTGRES_HOST')!,
      port: parseInt(this.configService.get<string>('POSTGRES_PORT')!, 10),
      username: this.configService.get<string>('POSTGRES_USER')!,
      password: this.configService.get<string>('POSTGRES_PASSWORD')!,
      database: this.configService.get<string>('POSTGRES_DB')!,
    };
  }

  get isDbLoggingEnabled(): boolean {
    return this.configService.get<string>('DB_LOGGER_ENABLED') === 'true';
  }

  get jwtSecretKey(): string {
    return this.configService.get<string>('JWT_SECRET_KEY') ?? '';
  }
}
