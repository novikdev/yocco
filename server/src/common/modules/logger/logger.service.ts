import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config';

@Injectable()
export class LoggerService extends Logger {
  constructor(private configService: AppConfigService) {
    super();
  }

  error(message: string, trace: string, context?: string) {
    if (this.configService.logLevels.includes('error')) {
      super.error(message, trace, context);
    }
  }

  log(message: string, context?: string) {
    if (this.configService.logLevels.includes('log')) {
      super.log(message, context);
    }
  }

  warn(message: string, context?: string) {
    if (this.configService.logLevels.includes('warn')) {
      super.warn(message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.configService.logLevels.includes('debug')) {
      super.debug(message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.configService.logLevels.includes('verbose')) {
      super.verbose(message, context);
    }
  }
}
