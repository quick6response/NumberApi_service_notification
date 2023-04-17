import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export class UserNumberNotificationDto extends ParameterStartDto {
  number: string;
  userId: number;
  /**
   * Заблокировали ли просмотр номера
   */
  isBlock: boolean;
}
