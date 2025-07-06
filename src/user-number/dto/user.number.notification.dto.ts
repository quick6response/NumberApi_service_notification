import { NumberEssence } from 'numberapi/microservice';
import { UserAnotherFindNumberDtoInterface } from 'numberapi/microservice/notification';

import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export interface UserNumberNotificationDto
  extends ParameterRequestUserDto,
    UserAnotherFindNumberDtoInterface {
  isAnon: boolean;
  numberId: NumberEssence['id'];
  userVkId: number;
  number: string;
  /**
   * Чей номер
   */
  userId: number;
  /**
   * Заблокировали ли просмотр номера
   */
  isBlock: boolean;
}
