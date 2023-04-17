import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export class CommentCreateDto extends ParameterStartDto {
  commentId: string;
  number: string;
  text: string;
  isAnon: boolean;
}
