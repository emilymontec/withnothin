import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchTagsDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  search?: string;
}
