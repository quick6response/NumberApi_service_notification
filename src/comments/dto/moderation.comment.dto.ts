import { ParameterStartDateDto } from '../../common/rabbitmq/types/parameter.start.date.dto';
import { CommentStatusEnum } from '../type/comment.status.enum';

export class ModerationCommentDto {
  date: string;
  // информация о том кто выполнил действие
  infoUserAction: ParameterStartDateDto;
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
  };
}
