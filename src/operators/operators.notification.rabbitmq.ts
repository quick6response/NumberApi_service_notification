import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from '@numberapi/microservices';
import { OperatorCreateDtoInterface } from '@numberapi/microservices/notification';

import { OperatorsService } from './operators.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class OperatorsNotificationRabbitmq {
  constructor(private readonly operatorService: OperatorsService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.operator_create_auto,
  })
  async createOperator(data: OperatorCreateDtoInterface) {
    return this.operatorService.notificationOperatorCreateAuto(data);
  }
}
