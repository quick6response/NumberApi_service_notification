import {
  CommentCreateDto,
  CommentDtoInterface,
  CommentEditChangeColumns,
  CommentEditDto,
  CommentNumberStatus,
} from '@quick_response/number_api_event';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export class CommentDto implements CommentDtoInterface {
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
  status: CommentNumberStatus;
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
  extends ParameterRequestUserDto
  implements CommentCreateDto
{
  @Type(() => CommentDto)
  comment: CommentDto;
}

export class VkCommentDeleteDto extends VkCommentCreateDto {}

export class VkCommentEditDto
  extends ParameterRequestUserDto
  implements CommentEditDto
{
  @Type(() => CommentDto)
  prevComment: CommentDto;
  @Type(() => CommentDto)
  nextComment: CommentDto;
  changes: CommentEditChangeColumns[];
}
