import { Injectable } from '@nestjs/common';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { OperatorCreateDto } from './dto/operator.create.dto';

@Injectable()
export class OperatorsService {
  constructor(@InjectVkApi() private readonly vk: VK) {}

  async notificationOperatorCreateAuto(parameters: OperatorCreateDto) {
    return this.vk.api.messages.send({
      message: `Создан новый оператор в базе:\n\nНазвание: ${parameters.name}\nФото: ${parameters.photo}`,
      chat_id: VKChatsEnum.LOGS_CHAT_DEV,
      random_id: getRandomId(),
    });
  }
}
