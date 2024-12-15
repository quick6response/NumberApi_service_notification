import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from 'microservice';

import { NumberFindDto, NumberFindErrorDto } from './dto/number.find.dto';
import { NumbersService } from './numbers.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class NumbersNotificationRabbitmq {
  constructor(private readonly numbersService: NumbersService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_find,
  })
  async getInfo(data: NumberFindDto) {
    await this.numbersService.getInfoNumber(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_find_error,
  })
  async errorFind(data: NumberFindErrorDto) {
    await this.numbersService.numberFindError(data);
  }
}
