import { Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('likes')
@ApiBearerAuth()
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async like(@CurrentUser() user: AuthenticatedUser, @Param('postId') postId: string) {
    await this.likesService.like(user.id, postId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlike(@CurrentUser() user: AuthenticatedUser, @Param('postId') postId: string) {
    await this.likesService.unlike(user.id, postId);
  }
}
