import {
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export class OperatorCreateDto extends ParameterRequestUserDto {
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
  @MinLength(1, {
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
