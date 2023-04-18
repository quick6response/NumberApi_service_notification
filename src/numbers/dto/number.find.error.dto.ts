import { IsString } from 'class-validator';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export class NumberFindErrorDto extends ParameterStartDto {
  error: unknown;
  @IsString()
  number: string;
}
