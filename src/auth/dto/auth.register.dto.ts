import { IsNumber } from 'class-validator';
import { ParameterStartDateDto } from '../../common/rabbitmq/types/parameter.start.date.dto';

export class AuthRegisterDto extends ParameterStartDateDto {
  @IsNumber()
  userId: number;
}
