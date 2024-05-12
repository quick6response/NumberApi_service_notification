import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export type UsersCreateInterface = ParameterRequestUserDto & {
  userId: number;
};
