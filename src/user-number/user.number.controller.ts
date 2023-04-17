import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';

@Controller('user-number')
export class UserNumberController {
  @RabbitSubscribe({
    exchange: 'events', // обращаемся к Exchange для получения
    routingKey: 'message.*', // выбираем ключи вида 'message.[имя]'
    queue: 'messages-queue', // создаем очередь
  })
  notification() {
    console.log('Уведомление');
    return 'ok';
  }
}
