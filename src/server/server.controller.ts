import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { ServerStartDto } from './dto/server.start.dto';
import { ServerStopDto } from './dto/server.stop.dto';
import { ServerNotificationService } from './server.notification.service';

// todo переписать это и ДТО операторов на новые типы из АПИ

const KEY_START: RabbitmqNotificationEventsType = 'service_api_start';
const KEY_STOP: RabbitmqNotificationEventsType = 'service_api_stop';

@Controller('server')
export class ServerController {
  constructor(
    private readonly serverNotificationService: ServerNotificationService,
  ) {}
  @EventPattern(KEY_START)
  async serverStart(@Payload() data: ServerStartDto) {
    return this.serverNotificationService.start(data);
  }

  @EventPattern(KEY_STOP)
  async serverStop(@Payload() data: ServerStopDto) {
    await this.serverNotificationService.stop(data);
  }
}
