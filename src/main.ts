import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitmqQueueConstant } from '@quick_response/number_api_event';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { SentryFilter } from './common/filters/sentry.filter';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            hostname: process.env.RABBITMQ_HOST,
            port: +process.env.RABBITMQ_PORT,
            password: process.env.RABBITMQ_PASSWORD,
            username: process.env.RABBITMQ_USER,
          },
        ],
        queue: RabbitmqQueueConstant.notification,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  const configService = app.get<ConfigService>(ConfigService);

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    // Performance Monitoring
    tracesSampleRate: 0.9, //  Capture 100% of the transactions
  });

  // Import the filter globally, capturing all exceptions on all routes
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  app.useGlobalInterceptors(
    new SentryInterceptor(configService.get<string>('NODE_ENV')),
  );

  app
    .init()
    .then(() => Logger.log(`Start microservice`))
    .catch((error) => {
      Logger.error('Error Start microservice', error);
      app.close();
    });
}
bootstrap();
