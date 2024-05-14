import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagVkMiniAppsActionUtils } from '../common/utils/message.tag.utils';
import { UserCreateDto, UserEditDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectVkApi() private readonly vk: VK) {
    vk.updates.on('message_new', (ctx) => {
      console.log(ctx);
    });
  }

  async notificationUserCreate(dto: UserCreateDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: this.getTextNotificationUserCrete(dto),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  async notificationUserEdit(dto: UserEditDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      message: this.getTextNotificationUserEdit(dto),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private getTextNotificationUserCrete(dto: UserCreateDto) {
    const text = `Пользователь @id${dto.userInfoVk.id} (${dto.userInfoVk.firstName} ${dto.userInfoVk.firstName}) создан создан в системе автоматически
    
    Время: ${dateUtils.getDateFormatNumber(dto.date)}
    
    Причина: ${dto.reason ?? 'Не указана'}
    
    Информация о пользователе:
    Айди: ${dto.userInfo.id}
    Имя: ${dto.userInfo.firstName}
    Фамилия: ${dto.userInfoVk.lastName}
    Подписка ВК Донута: пока не приходит
    
${messageTagVkMiniAppsActionUtils.getTagUserAction(dto.userInfo.id, dto.userInfo.idVk)}
    `;

    return text;
  }

  private getTextNotificationUserEdit(dto: UserEditDto) {
    const text = `Изменилась информация о пользователе userId${dto.nextValue.id}
    
    Информация о пользователе:
    Айди: ${dto.nextValue.id}
    Имя: ${dto.preValue.firstName} -> ${dto.nextValue.firstName}
    Фамилия: ${dto.preValue.lastName} -> ${dto.nextValue.lastName}
    Подписка ВК Донута: пока не приходит
  
    Время: ${dateUtils.getDateFormatNumber(dto.date)}
    
    Причина: ${dto.reason ?? 'Не указана'}
    
${messageTagVkMiniAppsActionUtils.getTagUserAction(dto.nextValue.id, dto.nextValue.idVk)}
    `;

    return text;
  }
}
