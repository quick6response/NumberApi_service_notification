import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppService } from './app.service';
import { SentryFilter } from './common/filters/sentry.filter';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    logger: new Logger(),
    bufferLogs: true,
    abortOnError: false,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const appService = app.get(AppService);

  // app.useGlobalFilters(new SentryFilter());
  // app.useGlobalInterceptors(
  //   new SentryInterceptor(configService.get<string>('NODE_ENV')),
  // );

  app.flushLogs();
  app
    .init()
    .then(() => Logger.log(`Start microservice`))
    .catch((error) => {
      Logger.error('Error Start microservice', error);
    });

  appService.listenUncaughtError('uncaughtException');
  appService.listenUncaughtError('unhandledRejection');
}
bootstrap();
