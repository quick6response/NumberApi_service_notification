import {
  AuthLoginDto,
  AuthRegistrationDto,
} from 'numberapi/microservice/notification';

import { ParameterStartDateDto } from '../../common/rabbitmq/types/parameter.start.date.dto';

export interface VkAuthLoginDto extends ParameterStartDateDto, AuthLoginDto {
  userId: number;
}

export interface VkAuthRegistrationDto
  extends ParameterStartDateDto,
    AuthRegistrationDto {
  userId: number;
}
