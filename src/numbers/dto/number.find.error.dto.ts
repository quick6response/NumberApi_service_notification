import { IsString } from 'class-validator';
import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export class NumberFindErrorDto extends ParameterRequestUserDto {
  error: unknown;
  @IsString()
  number: string;
}
