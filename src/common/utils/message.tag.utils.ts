import { StatusFindNumber } from '@quick_response/number_api_event';

export class MessageTagUtils {
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
  getTagUserAction(userId: number, idVk: number) {
    return `#user #userId${userId} #vk_id${idVk}`;
  }
  getTagAuth(type: 'login' | 'registration') {
    return type === 'login' ? '#login' : '#registration';
  }
  getTagPlatform() {
    return '#vk_mini_apps';
  }
  getTagNumberFind(status: StatusFindNumber) {
    return `#number_status_${status}`;
  }
}

export const messageTagVkMiniAppsActionUtils = new MessageTagUtils();
