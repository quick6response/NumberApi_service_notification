import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  MicroservicesEventConstant,
  OperatorCreateDtoInterface,
} from '@quick_response/number_api_event';
import { OperatorsService } from './operators.service';

@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorService: OperatorsService) {}
  @EventPattern(MicroservicesEventConstant.notification.operator_create_auto)
  async createOperator(@Payload() data: OperatorCreateDtoInterface) {
    return this.operatorService.notificationOperatorCreateAuto(data);
  }
}
