import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MutesService } from './mutes.service';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('mutes')
@ApiBearerAuth()
@Controller()
export class MutesController {
  constructor(private readonly mutesService: MutesService) {}

  @Post('users/:id/mute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async mute(@CurrentUser() user: AuthenticatedUser, @Param('id') mutedId: string) {
    await this.mutesService.mute(user.id, mutedId);
  }

  @Delete('users/:id/mute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unmute(@CurrentUser() user: AuthenticatedUser, @Param('id') mutedId: string) {
    await this.mutesService.unmute(user.id, mutedId);
  }

  @Get('mutes')
  getMyMutes(@CurrentUser() user: AuthenticatedUser) {
    return this.mutesService.getMutedUsers(user.id);
  }
}
