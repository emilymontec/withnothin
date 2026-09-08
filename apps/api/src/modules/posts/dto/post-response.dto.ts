import { Exclude, Expose, Type } from 'class-transformer';

class PostAuthorDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string | null;
}

class PostTechnologyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}

class PostTagDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}

class PostMediaDto {
  @Expose()
  id: string;

  @Expose()
  url: string;
}

@Exclude()
export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  content: string;

  @Expose()
  status: string;

  @Expose()
  visibility: string;

  @Expose()
  metadata: Record<string, unknown> | null;

  @Expose()
  @Type(() => PostAuthorDto)
  author: PostAuthorDto;

  @Expose()
  @Type(() => PostTechnologyDto)
  technologies: PostTechnologyDto[];

  @Expose()
  @Type(() => PostTagDto)
  tags: PostTagDto[];

  @Expose()
  @Type(() => PostMediaDto)
  media: PostMediaDto[];

  @Expose()
  likesCount: number;

  @Expose()
  commentsCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}
