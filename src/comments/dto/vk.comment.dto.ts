import {
  CommentCreateDtoInterface,
  CommentDtoInterface,
  CommentEditChangeColumns,
  CommentEditDtoInterface,
} from '@quick_response/number_api_event';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';
import { CommentStatusEnum } from '../type/comment.status.enum';

export class VkCommentDto implements CommentDtoInterface {
  @IsNumber()
  commentId: number;
  @IsString()
  number: string;
  @IsString()
  text: string;
  @IsBoolean()
  isAnon: boolean;
  @IsDate()
  createdAt: Date;
  @IsString()
  status: CommentStatusEnum;
  @IsDate()
  updatedAt: Date;
  @IsNumber()
  userId: number;
  @IsNumber()
  userVkId: number;
  @IsNumber()
  numberId: number;
}

export class VkCommentCreateDto
  extends ParameterStartDto
  implements CommentCreateDtoInterface
{
  comment: VkCommentDto;
}

export class VkCommentDeleteDto extends VkCommentCreateDto {}

export class VkCommentEditDto
  extends ParameterStartDto
  implements CommentEditDtoInterface
{
  prevComment: VkCommentDto;
  nextComment: VkCommentDto;
  changes: CommentEditChangeColumns[];
}
