import {
  RabbitmqNotificationKey,
  RabbitmqNotificationKeyType,
} from '../../common/rabbitmq/types/rabbitmq.notification.key.type';

const KEY_REGISTER: RabbitmqNotificationKey = 'auth_register_user';
export type AuthRegisterDto = RabbitmqNotificationKeyType[typeof KEY_REGISTER];
