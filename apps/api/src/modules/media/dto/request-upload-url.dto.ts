import { IsIn, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from '../media.constants';

export class RequestUploadUrlDto {
  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsIn(ALLOWED_IMAGE_MIME_TYPES, {
    message: `mimeType debe ser uno de: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`,
  })
  mimeType: string;

  @IsInt()
  @Min(1)
  @Max(MAX_IMAGE_SIZE_BYTES)
  sizeBytes: number;
}
