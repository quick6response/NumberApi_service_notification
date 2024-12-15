import { Injectable } from '@nestjs/common';
import {
  MicroservicesEventConstant,
  NumberOrganizationPinDto,
  OrganizationCreateDtoInterface,
  OrganizationCreateErrorDtoInterface,
  OrganizationUpdateDtoInterface,
  OrganizationUpdateErrorDtoInterface,
  RabbitmqExchangesConstant,
} from 'microservice';

import { OrganizationService } from './organization.service';
import { RabbitmqSubscribeNotificationService } from '../common/rabbitmq/decorators/rabbitmqSubscribeNotificationService';

@Injectable()
export class OrganizationNotificationRabbitmq {
  constructor(private readonly organizationService: OrganizationService) {}

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.organization_create_system,
  })
  async createOrganization(data: OrganizationCreateDtoInterface) {
    await this.organizationService.notificationOrganizationCreate(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.organization_create_system_error,
  })
  async createOrganizationError(data: OrganizationCreateErrorDtoInterface) {
    await this.organizationService.notificationOrganizationCreateError(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.organization_update_system,
  })
  async updateOrganization(data: OrganizationUpdateDtoInterface) {
    await this.organizationService.notificationOrganizationUpdate(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey:
      MicroservicesEventConstant.notification.organization_update_error,
  })
  async updateOrganizationError(data: OrganizationUpdateErrorDtoInterface) {
    await this.organizationService.notificationOrganizationUpdateError(data);
  }

  @RabbitmqSubscribeNotificationService({
    exchange: RabbitmqExchangesConstant.mainServiceApi,
    routingKey: MicroservicesEventConstant.notification.number_organization_pin,
  })
  async organizationPinNumber(data: NumberOrganizationPinDto) {
    await this.organizationService.notificationOrganizationPinNumber(data);
  }
}
