import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export type UsersCreateInterface = ParameterStartDto & {
  userId: number;
};
