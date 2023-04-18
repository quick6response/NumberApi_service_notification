import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export class UserNumberNotificationDto extends ParameterStartDto {
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
