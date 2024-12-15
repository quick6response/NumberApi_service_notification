import { Injectable, Logger } from '@nestjs/common';
import {
  NumberOrganizationPinDto,
  OrganizationCreateDtoInterface,
  OrganizationCreateErrorDtoInterface,
  OrganizationUpdateDtoInterface,
  OrganizationUpdateErrorDtoInterface,
} from 'microservice';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';

import { VKChatsEnum } from '../common/config/vk.chats.config';
import { dateUtils } from '../common/utils/date.utils';
import { messageTagUtils } from '../common/utils/message.tag.utils';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationOrganizationCreate(dto: OrganizationCreateDtoInterface) {
    try {
      const formattedMessage = `
Создана новая организация:

ID: ${dto.organization.id}
Название: ${dto.organization.name}
Описание: ${dto.organization.description}
Фото: ${dto.organization.photo.link} (ID: ${dto.organization.photo.id})

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagOrganizationCreate(dto.organization.id)}
`;

      await this.vk.api.messages.send({
        message: formattedMessage,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        result: false,
      };
    }
  }

  async notificationOrganizationUpdate(dto: OrganizationUpdateDtoInterface) {
    try {
      const formattedMessage = `
Обновлена организация id: ${dto.prevValue.id}

Название: ${dto.prevValue.name} → ${dto.nextValue.name}
Описание: ${dto.prevValue.description} → ${dto.nextValue.description}
Фото: ${dto.prevValue.photo.link} (ID: ${dto.prevValue.photo.id}) -> ${dto.nextValue.photo.link} (ID: ${dto.nextValue.photo.id})

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagOrganizationUpdate(dto.nextValue.id)}
`;

      await this.vk.api.messages.send({
        message: formattedMessage,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        result: false,
      };
    }
  }

  async notificationOrganizationCreateError(
    dto: OrganizationCreateErrorDtoInterface,
  ) {
    try {
      const formattedMessage = `
Ошибка создания организации в базе

Причина: ${dto.message}
Значение: ${JSON.stringify(dto.value)}

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagOrganizationCreateError()}
`;

      await this.vk.api.messages.send({
        message: formattedMessage,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        result: false,
      };
    }
  }

  async notificationOrganizationUpdateError(
    dto: OrganizationUpdateErrorDtoInterface,
  ) {
    try {
      const formattedMessage = `
Ошибка обновления организации в базе

ID: ${dto.organizationId}
Причина: ${dto.message}
Значение: ${JSON.stringify(dto.value)}

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagOrganizationUpdate(dto.organizationId, true)}
`;

      await this.vk.api.messages.send({
        message: formattedMessage,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        result: false,
      };
    }
  }

  async notificationOrganizationPinNumber(dto: NumberOrganizationPinDto) {
    try {
      const formattedMessage = `
Прикреплен номер к организации

Номер: ${dto.number.number} (ID: ${dto.number.numberId})
Организация: ${dto.organization.name} (ID: ${dto.organization.id})

Время: ${dateUtils.getDateFormatNumber(dto.date)}

${messageTagUtils.getTagNumber(dto.number.number, dto.number.numberId)} ${messageTagUtils.getTagOrganizationPinNumber(dto.organization.id, dto.number.numberId)}
`;

      await this.vk.api.messages.send({
        message: formattedMessage,
        chat_id: VKChatsEnum.LOGS_CHAT_DEV,
        random_id: getRandomId(),
      });

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        result: false,
      };
    }
  }
}
