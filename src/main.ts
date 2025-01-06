import { NestFactory } from '@nestjs/core';
import { Logger as LoggerPino } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppService } from './app.service';
import { Logger } from './common/logger/logger.config.factory';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.createMicroservice(AppModule, {
    // с буферизацией в дев моде логи не выводятся почему-то
    // bufferLogs: true,
    logger: logger,
    abortOnError: false,
  });
  app.useLogger(app.get(LoggerPino));

  const appService = app.get(AppService);

  // app.flushLogs();
  app
    .init()
    .then(() => logger.log(`Start microservice`))
    .catch((error) => {
      logger.error(error);
    });

  appService.listenUncaughtError('uncaughtException');
  appService.listenUncaughtError('unhandledRejection');
}
bootstrap();
