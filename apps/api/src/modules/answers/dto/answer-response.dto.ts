import { Exclude, Expose, Type } from 'class-transformer';

class AnswerAuthorDto {
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
export class AnswerResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  isAccepted: boolean;

  @Expose()
  votesScore: number;

  @Expose()
  @Type(() => AnswerAuthorDto)
  author: AnswerAuthorDto;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<AnswerResponseDto>) {
    Object.assign(this, partial);
  }
}
