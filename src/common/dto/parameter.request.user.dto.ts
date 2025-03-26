import {
  ParameterClientInfoActionEventAllPlatformInterface,
  ParameterRequestTelegramUserEventInterface,
  ParameterRequestVkUserEventInterface,
} from '@numberapi/microservices/notification';
import { ClientPlatform, User } from '@numberapi/microservices/share';

type ParameterRequestUserVkontakteEventType =
  ParameterRequestVkUserEventInterface['clientInfo'];

interface ParameterRequestUserVkontakteEvent
  extends ParameterRequestUserVkontakteEventType {}

type ParameterRequestUserTelegramEventType =
  ParameterRequestTelegramUserEventInterface['clientInfo'];

interface ParameterRequestUserTelegramEvent
  extends ParameterRequestUserTelegramEventType {}

export interface ParameterRequestUserDataDto {
  userId: number;
}

export interface ParameterRequestUserDto
  extends ParameterClientInfoActionEventAllPlatformInterface {
  user?: ParameterRequestUserDataDto;
  clientPlatform: ClientPlatform.VK | ClientPlatform.TELEGRAM;
  date: number;
  clientInfo:
    | ParameterRequestUserVkontakteEvent
    | ParameterRequestUserTelegramEvent;
}

/**
 * Функция для удаления персональной информации из объекта User
 * Оставляет только id и idVk
 * @param user Объект пользователя
 * @returns Объект с ограниченной информацией
 */
export function stripPersonalInfo(
  user?: User,
): Pick<User, 'id' | 'idVk'> | undefined {
  if (!user) return undefined;

  return {
    id: user.id,
    idVk: user.idVk,
  };
}
