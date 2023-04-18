import { IsNumber } from 'class-validator';
import { ParameterStartDateDto } from '../../common/rabbitmq/types/parameter.start.date.dto';
import { RabbitmqNotificationKey } from '../../common/rabbitmq/types/rabbitmq.notification.key.type';

const KEY_REGISTER: RabbitmqNotificationKey = 'auth_register_user';
export class AuthRegisterDto extends ParameterStartDateDto {
  @IsNumber()
  userId: number;
}
