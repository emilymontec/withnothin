import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowsService } from './follows.service';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('follows')
@Controller('users/:id')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post('follow')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async follow(@CurrentUser() user: AuthenticatedUser, @Param('id') followeeId: string) {
    await this.followsService.follow(user.id, followeeId);
  }

  @Delete('follow')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@CurrentUser() user: AuthenticatedUser, @Param('id') followeeId: string) {
    await this.followsService.unfollow(user.id, followeeId);
  }

  // Listas públicas — ver quién sigue a quién no requiere sesión.
  @Public()
  @Get('followers')
  getFollowers(@Param('id') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Public()
  @Get('following')
  getFollowing(@Param('id') userId: string) {
    return this.followsService.getFollowing(userId);
  }
}
