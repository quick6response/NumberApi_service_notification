import {
  AuthLoginDtoInterface,
  AuthRegistrationDtoInterface,
} from '@quick_response/number_api_event/dist/_types';
import { IsNumber } from 'class-validator';
import { ParameterStartDateDto } from '../../common/rabbitmq/types/parameter.start.date.dto';

export class VkAuthLoginDto
  extends ParameterStartDateDto
  implements AuthLoginDtoInterface
{
  @IsNumber()
  userId: number;
}

export class VkAuthRegistrationDto
  extends ParameterStartDateDto
  implements AuthRegistrationDtoInterface
{
  @IsNumber()
  userId: number;
}
