import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get<ConfigService>(ConfigService);

  // Sentry.init({
  //   dsn: process.env.SENTRY_DNS,
  //   // Performance Monitoring
  //   tracesSampleRate: 0.9, //  Capture 100% of the transactions
  // });

  // Import the filter globally, capturing all exceptions on all routes
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new SentryFilter(httpAdapter));
  //
  // app.useGlobalInterceptors(
  //   new SentryInterceptor(configService.get<string>('NODE_ENV')),
  // );

  app.flushLogs();
  app
    .init()
    .then(() => Logger.log(`Start microservice`))
    .catch((error) => {
      Logger.error('Error Start microservice', error);
      app.close();
    });
}
bootstrap();
