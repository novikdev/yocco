import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { LoggerService } from './logger.service';

@Module({
  imports: [AppConfigModule],

  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
