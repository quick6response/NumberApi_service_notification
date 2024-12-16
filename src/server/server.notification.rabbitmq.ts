import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from '@numberapi/microservices';

import { ServerStartDto } from './dto/server.start.dto';
import { ServerStopDto } from './dto/server.stop.dto';
import { ServerNotificationService } from './server.notification.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class ServerNotificationRabbitmq {
  constructor(
    private readonly serverNotificationService: ServerNotificationService,
  ) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.service_api_start,
  })
  async serverStart(data: ServerStartDto) {
    return this.serverNotificationService.start(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.service_api_stop,
  })
  async serverStop(data: ServerStopDto) {
    return this.serverNotificationService.stop(data);
  }
}
