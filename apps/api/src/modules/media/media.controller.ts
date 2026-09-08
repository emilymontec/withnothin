import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MediaService } from './media.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Throttle({ default: { limit: 20, ttl: 60_000 } }) // más estricto que el límite general
  @Post('upload-url')
  requestUploadUrl(@CurrentUser() user: AuthenticatedUser, @Body() dto: RequestUploadUrlDto) {
    return this.mediaService.requestUploadUrl(user.id, dto);
  }

  @Post(':id/confirm')
  confirmUpload(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.mediaService.confirmUpload(user.id, id);
  }
}
