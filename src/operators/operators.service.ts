import { Injectable, Logger } from '@nestjs/common';
import {
  OperatorCreateDtoInterface,
  OperatorBindIntegrationDtoInterface,
} from '@numberapi/microservices/notification';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';

@Injectable()
export class OperatorsService {
  private readonly logger = new Logger(OperatorsService.name);
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationOperatorCreateAuto(dto: OperatorCreateDtoInterface) {
    try {
      await this.vk.api.messages.send({
        message: this.getNotificationOperatorCreateAutoText(dto),
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
        dont_parse_links: true,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async notificationOperatorBindIntegration(
    dto: OperatorBindIntegrationDtoInterface,
  ) {
    try {
      await this.vk.api.messages.send({
        message: this.getNotificationOperatorBindIntegrationText(dto),
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private getNotificationOperatorCreateAutoText(
    dto: OperatorCreateDtoInterface,
  ) {
    return `🤖 Создан новый оператор в базе:
\nID: ${dto.operator.id}
Название: ${dto.operator.name}
Фото: ${dto.operator.photo}
Описание: ${dto.operator.description || 'Нет описания'}
Дата основания: ${dto.operator.foundingDate !== null ? `${dateUtils.getDateFormatNumber(dto.operator.foundingDate)}` : 'Не указана'}
\nВремя: ${dateUtils.getDateFormatNumber(dto.date)}
\n\n${messageTagUtils.getTagOperatorCreate(dto.operator.id)}`;
  }

  private getNotificationOperatorBindIntegrationText(
    dto: OperatorBindIntegrationDtoInterface,
  ) {
    return `🤖К оператору ${dto.operator.name} привязан оператор из интеграции.
   
Информация об операторе:
ID: ${dto.operator.id}
Название: ${dto.operator.name}
Интеграция: ${dto.integrationId}

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagOperatorBindIntegration(dto.operator.id, dto.integrationId)}
`;
  }
}
