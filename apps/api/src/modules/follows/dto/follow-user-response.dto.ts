import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FollowUserResponseDto {
  @Expose()
  userId: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string | null;

  constructor(partial: Partial<FollowUserResponseDto>) {
    Object.assign(this, partial);
  }
}
