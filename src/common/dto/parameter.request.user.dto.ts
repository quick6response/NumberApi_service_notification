import { ClientPlatform, User } from '@quick_response/number_api_event';
import { ParameterClientInfoActionEventAllPlatformInterface } from '@quick_response/number_api_event/dist/microservice/notification/types/parameter.client.info.type';
import { ParameterRequestTelegramUserEventInterface } from '@quick_response/number_api_event/dist/microservice/notification/types/parameter.request.tg.type';
import { ParameterRequestVkUserEventInterface } from '@quick_response/number_api_event/dist/microservice/notification/types/parameter.request.vk.type';
import { IsNumber, IsString } from 'class-validator';

type ParameterRequestUserVkontakteEventType =
  ParameterRequestVkUserEventInterface['clientInfo'];

class ParameterRequestUserVkontakteEvent
  implements ParameterRequestUserVkontakteEventType
{
  @IsString()
  vk_access_token_settings: string;
  @IsNumber()
  vk_app_id: number;
  @IsNumber()
  vk_are_notifications_enabled: number;
  @IsNumber()
  vk_is_app_user: number;
  @IsNumber()
  vk_is_favorite: number;
  @IsString()
  vk_language: string;
  @IsString()
  vk_platform: string;
  @IsString()
  vk_ref: string;
  @IsString()
  vk_ts: string;
  @IsNumber()
  vk_user_id: number;
  @IsString()
  sign: string;
  @IsString()
  ip: string;
  @IsString()
  userAgent: string;
}

type ParameterRequestUserTelegramEventType =
  ParameterRequestTelegramUserEventInterface['clientInfo'];

class ParameterRequestUserTelegramEvent
  implements ParameterRequestUserTelegramEventType
{
  ip: string;
  tg_user_id: number;
  userAgent: string;
}

export class ParameterRequestUserDto
  implements ParameterClientInfoActionEventAllPlatformInterface
{
  user?: User;
  clientPlatform: ClientPlatform.VK | ClientPlatform.TELEGRAM;
  date: number;
  clientInfo:
    | ParameterRequestUserVkontakteEvent
    | ParameterRequestUserTelegramEvent;
}
