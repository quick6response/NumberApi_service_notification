import { IsNumber } from 'class-validator';

/**
 * Параметры, которые приходят при событиях от сервиса - дата в unix
 */
export class ParameterRabbitmqDateDto {
  @IsNumber()
  date: number;
}
