import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export class UserNumberNotificationDto extends ParameterRequestUserDto {
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
