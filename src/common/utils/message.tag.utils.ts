import { StatusFindNumber } from '@numberapi/microservices/notification';

export class MessageTagUtils {
  getTagNumberFind(status: StatusFindNumber) {
    return `#number_status_${status}`;
  }
  getTagNumber(number: string, numberId: number) {
    return `#number #number_${number} #numberId_${numberId}`;
  }
  getTagErrorNumber(number: string, numberId: number) {
    return `#error #error_find_number #number #number_${number} #numberId_${numberId}`;
  }
  getTagComment(
    commentId: number,
    action: 'delete' | 'create' | 'edit' | 'moderation',
  ) {
    return `#comment #commentId_${commentId} #comment_${action}`;
  }
  getTagOperator(operatorId: number) {
    return `#operator #operatorId_${operatorId}`;
  }
  getTagOperatorCreate(operatorId: number) {
    return this.getTagOperator(operatorId) + ' #operator_create';
  }
  getTagOperatorBindIntegration(operatorId: number, integrationId: number) {
    return `${this.getTagOperator(operatorId)} #operator_bind #operatorintegrationId_${integrationId}`;
  }
  getTagOrganization(organizationId: number) {
    return `#organization #organizationId_${organizationId}`;
  }
  getTagOrganizationCreate(operatorId: number) {
    return this.getTagOrganization(operatorId) + ' #organization_create';
  }
  getTagOrganizationCreateError() {
    return '#organization_create_error';
  }
  getTagOrganizationUpdate(operatorId: number, isError = false) {
    return (
      this.getTagOrganization(operatorId) +
      ' #organization_update' +
      (isError ? '_error' : '')
    );
  }
  getTagOrganizationPinNumber(operatorId: number, numberId: number) {
    return (
      this.getTagOrganization(operatorId) +
      ' #organization_pin_numberId_' +
      numberId
    );
  }
  getTagNumberScheduleUpdateError(number: string, numberId: number) {
    return `#number #number_schedule_update_error #number_${number} #numberId_${numberId}`;
  }
  getTagNumberScheduleUpdateSuccess(number: string, numberId: number) {
    return `#number #number_schedule_update_success #number_${number} #numberId_${numberId}`;
  }
  getTagNumberScheduleUpdateSummary() {
    return `#number #number_schedule_update_summary`;
  }
}

export const messageTagUtils = new MessageTagUtils();
