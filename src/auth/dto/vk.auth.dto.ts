import {
  AuthLoginDto,
  AuthRegistrationDto,
} from '@numberapi/microservices/notification';
import { IsNumber } from 'class-validator';

import { ParameterStartDateDto } from '../../common/rabbitmq/types/parameter.start.date.dto';

export class VkAuthLoginDto
  extends ParameterStartDateDto
  implements AuthLoginDto
{
  @IsNumber()
  userId: number;
}

export class VkAuthRegistrationDto
  extends ParameterStartDateDto
  implements AuthRegistrationDto
{
  @IsNumber()
  userId: number;
}
