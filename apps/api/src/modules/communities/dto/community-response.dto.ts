import { Exclude, Expose, Type } from 'class-transformer';

class CommunityOwnerDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;
}

@Exclude()
export class CommunityResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  @Type(() => CommunityOwnerDto)
  owner: CommunityOwnerDto;

  @Expose()
  membersCount: number;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<CommunityResponseDto>) {
    Object.assign(this, partial);
  }
}
