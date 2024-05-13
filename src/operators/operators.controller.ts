import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationEventsType } from '../common/rabbitmq/types/rabbitmq.notification.events.type';
import { OperatorCreateDto } from './dto/operator.create.dto';
import { OperatorsService } from './operators.service';

// todo переписать это и ДТО операторов на новые типы из АПИ
const KEY_OPERATOR_CREATE: RabbitmqNotificationEventsType =
  'operator_create_auto';
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorService: OperatorsService) {}
  @MessagePattern(KEY_OPERATOR_CREATE)
  async createOperator(@Payload() data: OperatorCreateDto) {
    return this.operatorService.notificationOperatorCreateAuto(data);
  }
}
