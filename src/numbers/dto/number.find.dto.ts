import { NumberEssence } from 'numberapi/microservice';
import {
  NumberFindDto as NumberFindDtoEvent,
  NumberFindErrorDto as NumberFindErrorDtoEvent,
  StatusFindNumber,
} from 'numberapi/microservice/notification';

import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

/**
 * Для поиска номера
 */
export interface NumberFindDto
  extends ParameterRequestUserDto,
    NumberFindDtoEvent {
  number: { number: NumberEssence['number']; numberId: NumberEssence['id'] };
  status: StatusFindNumber;
}

export interface NumberFindErrorDto
  extends ParameterRequestUserDto,
    NumberFindErrorDtoEvent {
  number: { number: NumberEssence['number']; numberId: NumberEssence['id'] };
  status: StatusFindNumber;
  errorText: string;
}
