import { CommentStatusEnum } from './comment.status.enum';

export interface CommentInterface {
  id: number;

  text: string;

  ip: string;

  status: CommentStatusEnum;

  isAnon: boolean;

  number: any;

  numberId: number;

  user: any;

  userId: number;
}
