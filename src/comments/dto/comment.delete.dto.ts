import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';
import { CommentCreateDto } from './comment.create.dto';

export class CommentDeleteDto extends IntersectionType(
  ParameterStartDto,
  PickType(CommentCreateDto, ['commentId', 'number'] as const),
) {}
