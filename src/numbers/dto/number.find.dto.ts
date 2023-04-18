import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

/**
 * Для поиска номера
 */
export class NumberFindDto extends ParameterStartDto {
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
