import { IsOptional, IsString } from 'class-validator';
import { CursorPaginationDto } from '../../../common/pagination/pagination.dto';

export class FindProjectsQueryDto extends CursorPaginationDto {
  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsString()
  technology?: string; // slug
}
