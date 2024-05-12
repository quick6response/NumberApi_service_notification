import {
  CommentNumberModerateDto,
  CommentStatusEnum,
} from '@quick_response/number_api_event';
import { ParameterRequestUserDto } from '../../common/dto/parameter.request.user.dto';

export class VkModerationCommentDto
  extends ParameterRequestUserDto
  implements CommentNumberModerateDto
{
  // комментарий
  comment: {
    commentId: number;
    userId: number;
    text: string;
    isAnon: boolean;
    status: CommentStatusEnum;
    prevStatus: CommentStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    userVkId: number;
    number: string;
    numberId: number;
  };
}
