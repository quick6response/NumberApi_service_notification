import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            hostname: process.env.RABBIT_HOST,
            port: +process.env.RABBIT_PORT,
            password: process.env.RABBIT_PASSWORD,
            username: process.env.RABBIT_USER,
          },
        ],
        queue: 'vk_notification_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app
    .listen()
    .then(() => console.log(`Start microservice`))
    .catch((error) => console.error('Error Start microservice', error));
}
bootstrap();
