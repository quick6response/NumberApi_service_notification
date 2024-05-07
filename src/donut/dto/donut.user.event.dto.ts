import { ParameterRabbitmqDateDto } from '../../common/dto/parameter.rabbitmq.date.dto';

export class DonutUserEventDto extends ParameterRabbitmqDateDto {
  // айди пользователя в сервисе
  userId: number;
  // айди пользователя вк
  userVkId: number;
}
