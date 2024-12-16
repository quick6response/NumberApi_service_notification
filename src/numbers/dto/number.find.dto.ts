import { NumberEssence } from '@numberapi/microservices';
import {
  NumberFindDto as NumberFindDtoEvent,
  NumberFindErrorDto as NumberFindErrorDtoEvent,
  StatusFindNumber,
} from '@numberapi/microservices/notification';

import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

/**
 * Для поиска номера
 */
export class NumberFindDto
  extends ParameterRequestUserDto
  implements NumberFindDtoEvent
{
  number: { number: NumberEssence['number']; numberId: NumberEssence['id'] };
  status: StatusFindNumber;
}

export class NumberFindErrorDto
  extends ParameterRequestUserDto
  implements NumberFindErrorDtoEvent
{
  number: { number: NumberEssence['number']; numberId: NumberEssence['id'] };
  status: StatusFindNumber;
  errorText: unknown;
}
