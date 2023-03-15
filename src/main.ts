import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

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
            password: process.env.RABBITMQ_DEFAULT_PASS,
            username: process.env.RABBITMQ_DEFAULT_USER,
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
