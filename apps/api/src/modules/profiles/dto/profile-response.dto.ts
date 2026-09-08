import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileResponseDto {
  @Expose()
  userId: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  bio: string | null;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  headline: string | null;

  @Expose()
  location: string | null;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<ProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
