import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AdminUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  username: string | null;

  @Expose()
  displayName: string | null;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<AdminUserResponseDto>) {
    Object.assign(this, partial);
  }
}
