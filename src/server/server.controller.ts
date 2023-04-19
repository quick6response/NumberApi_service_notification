import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationKey } from '../common/rabbitmq/types/rabbitmq.notification.key.type';
import { ServerStartDto } from './dto/server.start.dto';
import { ServerStopDto } from './dto/server.stop.dto';
import { ServerNotificationService } from './server.notification.service';

const KEY_START: RabbitmqNotificationKey = 'server_start';
const KEY_STOP: RabbitmqNotificationKey = 'server_stop';

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
