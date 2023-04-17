import {
  RabbitmqNotificationKey,
  RabbitmqNotificationKeyType,
} from '../../common/rabbitmq/types/rabbitmq.notification.key.type';

const KEY_LOGIN: RabbitmqNotificationKey = 'auth_login_user';
export type AuthLoginDto = RabbitmqNotificationKeyType[typeof KEY_LOGIN];
