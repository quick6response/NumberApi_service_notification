import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainConstantEventName } from '@quick_response/number_api_event';
import {
  OrganizationCreateDto,
  OrganizationCreateErrorDto,
  OrganizationPinNumberDto,
  OrganizationUpdateDto,
  OrganizationUpdateErrorDto,
} from '../operators/dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // todo lобавить тут проверку на верный отет и только тогда подтвердить сообщение, как это сделано в друх местах
  @MessagePattern(MainConstantEventName.notification.organization_create_system)
  async createOrganization(@Payload() data: OrganizationCreateDto) {
    return this.organizationService.notificationOrganizationCreate(data);
  }

  @MessagePattern(
    MainConstantEventName.notification.organization_create_system_error,
  )
  async createOrganizationError(@Payload() data: OrganizationCreateErrorDto) {
    return this.organizationService.notificationOrganizationCreateError(data);
  }

  @MessagePattern(MainConstantEventName.notification.organization_update_system)
  async updateOrganization(@Payload() data: OrganizationUpdateDto) {
    return this.organizationService.notificationOrganizationUpdate(data);
  }

  @MessagePattern(MainConstantEventName.notification.organization_update_error)
  async updateOrganizationError(@Payload() data: OrganizationUpdateErrorDto) {
    return this.organizationService.notificationOrganizationUpdateError(data);
  }

  @MessagePattern(MainConstantEventName.notification.number_organization_pin)
  async organizationPinNumber(@Payload() data: OrganizationPinNumberDto) {
    return this.organizationService.notificationOrganizationPinNumber(data);
  }
}
