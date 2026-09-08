import { Exclude, Expose, Type } from 'class-transformer';

class CommentAuthorDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string | null;
}

@Exclude()
export class CommentResponseDto {
  @Expose()
  id: string;

  // Un comentario borrado conserva su lugar en el hilo, pero sin contenido/autor real.
  @Expose()
  content: string;

  @Expose()
  parentCommentId: string | null;

  @Expose()
  isDeleted: boolean;

  @Expose()
  @Type(() => CommentAuthorDto)
  author: CommentAuthorDto | null;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial);
  }
}
