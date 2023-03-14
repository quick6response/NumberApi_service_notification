import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

/**
 * Для поиска номера
 */
export class NumberFindDto extends ParameterStartDto {
  numberId: number;
  number: string;
  isAnon: boolean;
  isUpdate?: boolean;
  isNewNumber?: boolean;
}
