import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export const SEARCH_TYPES = ['all', 'posts', 'profiles', 'technologies'] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];

export class SearchQueryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  q: string;

  @IsOptional()
  @IsIn(SEARCH_TYPES)
  type?: SearchType;
}
