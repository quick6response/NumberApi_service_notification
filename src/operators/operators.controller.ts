import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitmqNotificationKey } from '../common/rabbitmq/types/rabbitmq.notification.key.type';
import { OperatorCreateDto } from './dto/operator.create.dto';
import { OperatorsService } from './operators.service';

const KEY_OPERATOR_CREATE: RabbitmqNotificationKey = 'operator_create_auto';
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorService: OperatorsService) {}
  @MessagePattern(KEY_OPERATOR_CREATE)
  async createOperator(@Payload() data: OperatorCreateDto) {
    return this.operatorService.notificationOperatorCreateAuto(data);
  }
}
