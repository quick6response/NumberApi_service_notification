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
            hostname: 'localhost',
            port: 5672,
            password: 'rmpassword',
            username: 'rmuser',
          },
        ],
        queue: 'vk_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app
    .listen()
    .then((result) => console.log(`Start MicroRabbit ${result}`))
    .catch((error) => console.error('Error Start'));
}
bootstrap();
