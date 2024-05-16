import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event';
import { OperatorCreateDto } from '../organization/dto/operator.create.dto';
import { OperatorsService } from './operators.service';

@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorService: OperatorsService) {}
  @MessagePattern(MainConstantEventName.notification.operator_create_auto)
  async createOperator(@Payload() data: OperatorCreateDto) {
    return this.operatorService.notificationOperatorCreateAuto(data);
  }
}
