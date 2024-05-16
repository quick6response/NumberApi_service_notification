import { OperatorCreateDtoInterface } from '@quick_response/number_api_event';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

type OperatorEventDto = OperatorCreateDtoInterface['operator'];

export class OperatorDto implements OperatorEventDto {
  @IsNumber()
  id: number;

  @IsString({ message: 'Должно быть строкой' })
  @MinLength(1, {
    message: 'Должно быть длиннее $constraint1 символов',
  })
  @MaxLength(255, {
    message: 'Должно быть короче $constraint1 символов',
  })
  name: string;

  @IsUrl({ require_protocol: true, require_port: true })
  photo: string;

  @IsString({ message: 'Должно быть строкой' })
  @MinLength(0, {
    message: 'Должно быть длиннее $constraint1 символов',
  })
  @MaxLength(255, {
    message: 'Должно быть короче $constraint1 символов',
  })
  @IsOptional()
  description?: string;

  @IsDate({ message: 'Должно быть датой' })
  foundingDate?: string;
}

export class OperatorCreateDto implements OperatorCreateDtoInterface {
  @IsNumber()
  date: number;
  @Type(() => OperatorDto)
  operator: OperatorDto;
}
