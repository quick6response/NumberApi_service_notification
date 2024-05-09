import {
  CommentNumberModerateDtoInterface,
  CommentStatusEnum,
  UserDtoInterface,
} from '@quick_response/number_api_event';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export class VkModerationCommentDto
  extends ParameterStartDto
  implements CommentNumberModerateDtoInterface
{
  date: number;
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
  userInfo: Omit<UserDtoInterface, 'numberUserId'>;
}
