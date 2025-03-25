import { CommentNumberStatus } from '@numberapi/microservices';
import {
  CommentCreateDto,
  CommentDtoInterface,
  CommentEditChangeColumns,
  CommentEditDto,
} from '@numberapi/microservices/notification';

import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export interface CommentDto extends CommentDtoInterface {
  commentId: number;
  number: string;
  text: string;
  isAnon: boolean;
  createdAt: Date;
  status: CommentNumberStatus;
  updatedAt: Date;
  userId: number;
  userVkId: number;
  numberId: number;
}

export interface VkCommentCreateDto
  extends ParameterRequestUserDto,
    CommentCreateDto {
  comment: CommentDto;
}

export interface VkCommentDeleteDto extends VkCommentCreateDto {}

export interface VkCommentEditDto
  extends ParameterRequestUserDto,
    CommentEditDto {
  prevComment: CommentDto;
  nextComment: CommentDto;
  changes: CommentEditChangeColumns[];
}
