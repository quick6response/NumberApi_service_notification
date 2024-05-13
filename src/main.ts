import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitmqQueueConfig } from '@quick_response/number_api_event';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        noAck: false,
        urls: [
          {
            hostname: process.env.RABBITMQ_HOST,
            port: +process.env.RABBITMQ_PORT,
            password: process.env.RABBITMQ_PASSWORD,
            username: process.env.RABBITMQ_USER,
          },
        ],
        queue: RabbitmqQueueConfig.notification,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     enableDebugMessages: true,
  //     forbidUnknownValues: false,
  //     validationError: {
  //       target: true,
  //       value: true,
  //     },
  //     forbidNonWhitelisted: true,
  //     validateCustomDecorators: true,
  //     skipUndefinedProperties: true,
  //
  //     transform: true,
  //     exceptionFactory: (array) => {
  //       const message = array.map((error) => {
  //         return `${error.property} - ${Object.values(error.constraints).join(
  //           ', ',
  //         )}`;
  //       });
  //       throw new RpcException(message);
  //     },
  //   }),
  // );

  app
    .listen()
    .then(() => console.log(`Start microservice`))
    .catch((error) => {
      console.error('Error Start microservice', error);
      app.close();
    });
}
bootstrap();
