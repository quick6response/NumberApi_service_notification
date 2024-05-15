export class MessagePlatformTagUtils {
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

export const messageTagVkMiniAppsActionUtils = new MessagePlatformTagUtils();
