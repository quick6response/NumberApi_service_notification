import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { loggerConfigFactory } from './logger.config.factory';

@Module({
  imports: [PinoLoggerModule.forRootAsync(loggerConfigFactory)],
  exports: [],
})
export class LoggerModule {}
