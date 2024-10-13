import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  MicroservicesEventConstant,
  NumberOrganizationPinDto,
  OrganizationCreateDtoInterface,
  OrganizationCreateErrorDtoInterface,
  OrganizationUpdateDtoInterface,
  OrganizationUpdateErrorDtoInterface,
} from '@quick_response/number_api_event';

import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @EventPattern(
    MicroservicesEventConstant.notification.organization_create_system,
  )
  async createOrganization(@Payload() data: OrganizationCreateDtoInterface) {
    await this.organizationService.notificationOrganizationCreate(data);
  }

  @EventPattern(
    MicroservicesEventConstant.notification.organization_create_system_error,
  )
  async createOrganizationError(
    @Payload() data: OrganizationCreateErrorDtoInterface,
  ) {
    await this.organizationService.notificationOrganizationCreateError(data);
  }

  @EventPattern(
    MicroservicesEventConstant.notification.organization_update_system,
  )
  async updateOrganization(@Payload() data: OrganizationUpdateDtoInterface) {
    await this.organizationService.notificationOrganizationUpdate(data);
  }

  @EventPattern(
    MicroservicesEventConstant.notification.organization_update_error,
  )
  async updateOrganizationError(
    @Payload() data: OrganizationUpdateErrorDtoInterface,
  ) {
    await this.organizationService.notificationOrganizationUpdateError(data);
  }

  @EventPattern(MicroservicesEventConstant.notification.number_organization_pin)
  async organizationPinNumber(@Payload() data: NumberOrganizationPinDto) {
    await this.organizationService.notificationOrganizationPinNumber(data);
  }
}
