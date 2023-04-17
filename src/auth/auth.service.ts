import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { InjectVkApi } from 'nestjs-vk';
import { getRandomId, VK } from 'vk-io';
import { VKChatsEnum } from '../common/config/vk.chats.config';
import { ParameterStartDto } from '../common/dto/parameter.start.dto';
import { dateUtils } from '../common/utils/date.utils';
import { VkUtils } from '../common/utils/vk.utils';
import { VkService } from '../vk/vk.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly vkHelpService: VkService,
  ) {}

  async loginUser(data: AuthLoginDto) {
    await this.vk.api.messages.send({
      message: await this.getTextLogin(data),
      chat_id: VKChatsEnum.LOGS_CHAT,
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  async registrationUser(parameters: AuthRegisterDto) {
    await this.vk.api.messages.send({
      chat_id: VKChatsEnum.LOGS_CHAT,
      message: await this.getTextRegistration(parameters),
      random_id: getRandomId(),
      disable_mentions: true,
    });
    return { result: true };
  }

  private async getTextRegistration(data: AuthRegisterDto): Promise<string> {
    const user = await this.vkHelpService.getInfoUserVk(data.vk_user_id);
    return `@id${data.vk_user_id} (${user.first_name} ${
      user.last_name
    }) зарегистрировался в приложение (${data.userId}).\n\n
Время: ${dateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#registerUser #id${data.vk_user_id} #registerUser_${data.vk_user_id}`;
  }

  private async getTextLogin(data: ParameterStartDto): Promise<string> {
    const user = await this.vkHelpService.getInfoUserVk(data.vk_user_id);
    return `@id${data.vk_user_id} (${user.first_name} ${
      user.last_name
    }) авторизация в приложение (${
      data.vk_app_id === this.configService.get<number>('APP_ID')
        ? 'Dev'
        : 'Prod'
    })\n\n
Время: ${dateUtils.getDateFormatNumber(data.date)}\nIP: ${data.ip}\n\n
vk_ref — ${VkUtils.getRef(data.vk_ref)} (${data.vk_ref})
vk_platform — ${VkUtils.getPlatform(data.vk_platform)} (${data.vk_platform})\n\n
#login #id${data.vk_user_id} #login_${data.vk_user_id}`;
  }
}
