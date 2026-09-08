import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class NotificationResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  payload: Record<string, unknown> | null;

  @Expose()
  isRead: boolean;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<NotificationResponseDto>) {
    Object.assign(this, partial);
  }
}
