import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

/**
 * Для поиска номера
 */
export class NumberFindDto extends ParameterRequestUserDto {
  @IsNumber()
  numberId: number;
  @IsString()
  number: string;
  @IsBoolean()
  isAnon: boolean;
  @IsBoolean()
  isUpdate?: boolean;
  @IsBoolean()
  isNewNumber?: boolean;
}
