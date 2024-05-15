import { StatusFindNumber } from '@quick_response/number_api_event';

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
}

export const messageTagUtils = new MessageTagUtils();
