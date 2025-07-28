import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  RabbitmqExchangesConstant,
} from 'numberapi-common/microservice';
import {
  NumberScheduleCreatedErrorDto,
  NumberScheduleCreatedSuccessDto,
  NumberScheduleUpdatedErrorDto,
  NumberScheduleUpdatedSuccessDto,
  NumberScheduleUpdatedSummaryDto,
} from 'numberapi-common/microservice/notification';

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

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_schedule_updated_success,
  })
  async notificationScheduleUpdatedSuccess(
    data: NumberScheduleUpdatedSuccessDto,
  ) {
    await this.numbersService.notificationNumberScheduleUpdateSuccess(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_schedule_updated_error,
  })
  async notificationScheduleUpdatedError(data: NumberScheduleUpdatedErrorDto) {
    await this.numbersService.notificationNumberScheduleUpdateError(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_schedule_updated_summary,
  })
  async notificationScheduleUpdatedSummary(
    data: NumberScheduleUpdatedSummaryDto,
  ): Promise<void> {
    await this.numbersService.notificationNumberScheduleUpdateSummary(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_schedule_created_success,
  })
  async notificationScheduleCreatedSuccess(
    data: NumberScheduleCreatedSuccessDto,
  ) {
    await this.numbersService.notificationNumberScheduleCreatedSuccess(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.number_schedule_created_error,
  })
  async notificationScheduleCreatedError(data: NumberScheduleCreatedErrorDto) {
    await this.numbersService.notificationNumberScheduleCreatedError(data);
  }
}
