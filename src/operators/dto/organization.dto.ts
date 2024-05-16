import {
  NumberEssence,
  NumberOrganizationPinDto,
  OrganizationCreateDtoInterface,
  OrganizationCreateErrorDtoInterface,
  OrganizationDtoInterface,
  OrganizationUpdateDtoInterface,
  OrganizationUpdateErrorDtoInterface,
} from '@quick_response/number_api_event';
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

type OrganizationEventDto = OrganizationCreateDtoInterface['organization'];

export class OrganizationDto implements OrganizationEventDto {
  @IsString({ message: 'Должно быть строкой' })
  site: string;

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

export class OrganizationCreateDto implements OrganizationCreateDtoInterface {
  @IsNumber()
  date: number;

  @Type(() => OrganizationDto)
  organization: OrganizationDto;
}

export class OrganizationCreateErrorDto
  implements OrganizationCreateErrorDtoInterface
{
  @IsNumber()
  date: number;

  message: string | unknown;
}

export class OrganizationUpdateDto implements OrganizationUpdateDtoInterface {
  @IsNumber()
  date: number;

  @Type(() => OrganizationDto)
  prevValue: OrganizationDto;

  @Type(() => OrganizationDto)
  nextValue: OrganizationDto;
}

export class OrganizationUpdateErrorDto
  implements OrganizationUpdateErrorDtoInterface
{
  @IsNumber()
  date: number;

  message: string | unknown;

  organizationId: number;
}

export class OrganizationPinNumberDto implements NumberOrganizationPinDto {
  date: number;
  number: { number: NumberEssence['number']; numberId: NumberEssence['id'] };
  organization: OrganizationDtoInterface;
  status: 'create' | 'update';
}
