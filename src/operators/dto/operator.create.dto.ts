import { OperatorCreateDtoInterface } from 'microservice';

type OperatorEventDto = OperatorCreateDtoInterface['operator'];

export class OperatorDto implements OperatorEventDto {
  id: number;

  name: string;

  photo: string;

  description: string | null;

  foundingDate: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export class OperatorCreateDto implements OperatorCreateDtoInterface {
  date: number;
  operator: OperatorDto;
}
