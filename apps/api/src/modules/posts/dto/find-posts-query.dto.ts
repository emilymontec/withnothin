import { PostType } from '@withnothin/shared-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CursorPaginationDto } from '../../../common/pagination/pagination.dto';

export class FindPostsQueryDto extends CursorPaginationDto {
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  // Slug de tecnología, no id — más legible en la URL (?technology=kotlin)
  @IsOptional()
  @IsString()
  technology?: string;

  @IsOptional()
  @IsString()
  authorId?: string;
}
