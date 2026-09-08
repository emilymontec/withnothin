import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MediaResponseDto {
  @Expose()
  id: string;

  @Expose()
  url: string;

  @Expose()
  mimeType: string;

  @Expose()
  status: string;

  constructor(partial: Partial<MediaResponseDto>) {
    Object.assign(this, partial);
  }
}
