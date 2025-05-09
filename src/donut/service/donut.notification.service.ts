import { Injectable } from '@nestjs/common';
import { Keyboard } from 'vk-io';

import { messageTagVkMiniAppsActionUtils } from 'src/common/utils/message.platform.tag.utils';
import { VkService } from 'src/vk/vk.service';

import { DonutVkService } from './donut.vk.service';
import { VKChatsEnum } from '../../common/config/vk.chats.config';
import { dateUtils } from '../../common/utils/date.utils';
import { DonutUserEventDto } from '../dto/donut.user.event.dto';

@Injectable()
export class DonutNotificationService {
  constructor(
    private readonly vkHelpService: VkService,
    private readonly donutVkService: DonutVkService,
  ) {}

  /**
   * Подписка продлена сервисом
   */
  async subscriptionProlonged(data: DonutUserEventDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userVkId);

    const textUser = `&#129395; ${user.first_name}, благодарим Вас за продление подписки VK Donut! Все Ваши преимущества сохранены, также о них можно узнать в [https://vk.com/@id_called-donut|статье].`;

    await this.donutVkService.sendMessageUser(user.id, textUser, {
      keyboard: this.getKeyboardAboutBenefits(),
    });

    const textChat = `[${dateUtils.getDateFormatNumber(data.date)}] &#129395; @id${
      data.userId
    } (${user.first_name} ${user.last_name}) подписка продлена.
    ${this.donutVkService.getTextDisableMessageSendUserDonut()}
    \n#donut_prolonged #donutSubscriptionProlonged ${messageTagVkMiniAppsActionUtils.getTagUserAction(data.userId, data.userVkId)}`;

    await this.donutVkService.sendMessageChat(textChat, [
      VKChatsEnum.LOGS_CHAT_DEV,
    ]);
  }

  /**
   * Подписка выдана сервисом
   */
  async subscriptionIssuance(data: DonutUserEventDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userVkId);

    const textUser = `&#129395; ${user.first_name}, благодарим Вас за оформление подписки VK Donut!\nО преимуществах подписки, можно узнать в [https://vk.com/@id_called-donut|статье].`;
    await this.donutVkService.sendMessageUser(user.id, textUser, {
      keyboard: this.getKeyboardAboutBenefits(),
    });

    const textChat = `Пользователю @id${user.id} (${user.first_name} ${
      user.last_name
    }) была выдана подписка VK Donut.
    \nВремя: ${dateUtils.getDateFormatNumber(data.date)}
    ${this.donutVkService.getTextDisableMessageSendUserDonut()}
    \n#donut_issuance #subscriptionIssuance ${messageTagVkMiniAppsActionUtils.getTagUserAction(data.userId, data.userVkId)}`;

    await this.donutVkService.sendMessageChat(textChat, [
      VKChatsEnum.LOGS_CHAT_DEV,
    ]);
  }

  /**
   * Подписка отключена сервисом
   */
  async subscriptionExpired(data: DonutUserEventDto) {
    const user = await this.vkHelpService.getInfoUserVk(data.userVkId);

    const textUser = `&#128553; ${user.first_name}, подписка VK Donut истекла. Все преимущества были выключены.`;
    await this.donutVkService.sendMessageUser(user.id, textUser);

    const textChat = `Подписка у пользователя @id${data.userId} (${
      user.first_name
    } ${user.last_name}) была выключена.
    \n\nВремя: ${dateUtils.getDateFormatNumber(data.date)}
    ${this.donutVkService.getTextDisableMessageSendUserDonut()}
    \n\n#donut_Expired #subscriptionExpired ${messageTagVkMiniAppsActionUtils.getTagUserAction(data.userId, data.userVkId)}`;

    await this.donutVkService.sendMessageChat(textChat, [
      VKChatsEnum.LOGS_CHAT_DEV,
    ]);
  }

  private getKeyboardAboutBenefits() {
    const builder = Keyboard.keyboard([
      // Одна кнопка
      [
        Keyboard.callbackButton({
          label: 'Подробнее про подписку VK Donut',
          color: 'secondary',
          payload: {
            type: 'text',
            cmd: 'donut about',
          },
        }),
      ],
    ]).inline();

    return builder;
  }
}
