export class MessageTagUtils {
  getTagNumber(number: string, numberId: number) {
    return `#number #number_${number} #numberId_${numberId}`;
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
}

export const messageTagVkMiniAppsActionUtils = new MessageTagUtils();
