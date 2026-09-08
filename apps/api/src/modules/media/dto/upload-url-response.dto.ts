import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploadUrlResponseDto {
  @Expose()
  mediaId: string;

  @Expose()
  uploadUrl: string;

  @Expose()
  path: string;

  @Expose()
  token: string;

  constructor(partial: Partial<UploadUrlResponseDto>) {
    Object.assign(this, partial);
  }
}
