import { TagMessageActionUserVk } from '../constants/TagMessageActionUserVk';

export class MessagePlatformTagUtils {
  getTagUserAction(userId: number, idVk: number) {
    return `#user #${TagMessageActionUserVk.USER_ID}${userId} #${TagMessageActionUserVk.VK_ID}${idVk}`;
  }
  getTagAuth(type: 'login' | 'registration') {
    return type === 'login' ? '#login' : '#registration';
  }
  getTagPlatform() {
    return '#vk_mini_apps';
  }
}

export const messageTagVkMiniAppsActionUtils = new MessagePlatformTagUtils();
