import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { NumberEssence, UserAnotherFindNumberDtoInterface } from 'microservice';

import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export class UserNumberNotificationDto
  extends ParameterRequestUserDto
  implements UserAnotherFindNumberDtoInterface
{
  isAnon: boolean;
  numberId: NumberEssence['id'];
  userVkId: number;

  @IsString()
  number: string;
  /**
   * Чей номер
   */
  @IsNumber()
  userId: number;
  /**
   * Заблокировали ли просмотр номера
   */
  @IsBoolean()
  isBlock: boolean;
}
