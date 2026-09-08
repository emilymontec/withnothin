import { Exclude, Expose, Type } from 'class-transformer';
import { PostResponseDto } from '../../posts/dto/post-response.dto';

class SearchProfileResultDto {
  @Expose()
  userId: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string | null;
}

class SearchTechnologyResultDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}

@Exclude()
export class SearchResultsDto {
  @Expose()
  @Type(() => PostResponseDto)
  posts?: PostResponseDto[];

  @Expose()
  @Type(() => SearchProfileResultDto)
  profiles?: SearchProfileResultDto[];

  @Expose()
  @Type(() => SearchTechnologyResultDto)
  technologies?: SearchTechnologyResultDto[];

  constructor(partial: Partial<SearchResultsDto>) {
    Object.assign(this, partial);
  }
}
