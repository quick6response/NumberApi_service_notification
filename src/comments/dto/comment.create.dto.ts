import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ParameterStartDto } from '../../common/dto/parameter.start.dto';

export class CommentCreateDto extends ParameterStartDto {
  @IsNumber()
  commentId: number;
  @IsString()
  number: string;
  @IsString()
  text: string;
  @IsBoolean()
  isAnon: boolean;
}
