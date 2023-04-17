import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dto/comment.create.dto';
import { CommentDeleteDto } from './dto/comment.delete.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @MessagePattern({ comment: 'new' })
  async commentNew(@Payload() data: CommentCreateDto) {
    return this.commentsService.newComment(data);
  }

  @MessagePattern({ comment: 'delete' })
  async commentDelete(@Payload() data: CommentDeleteDto) {
    return this.commentsService.deleteComment(data);
  }
}
