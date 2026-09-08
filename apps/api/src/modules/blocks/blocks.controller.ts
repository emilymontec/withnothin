import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('blocks')
@ApiBearerAuth()
@Controller()
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post('users/:id/block')
  @HttpCode(HttpStatus.NO_CONTENT)
  async block(@CurrentUser() user: AuthenticatedUser, @Param('id') blockedId: string) {
    await this.blocksService.block(user.id, blockedId);
  }

  @Delete('users/:id/block')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unblock(@CurrentUser() user: AuthenticatedUser, @Param('id') blockedId: string) {
    await this.blocksService.unblock(user.id, blockedId);
  }

  // "Mis bloqueados" — scoped al usuario, nunca público (a diferencia de followers/following).
  @Get('blocks')
  getMyBlocks(@CurrentUser() user: AuthenticatedUser) {
    return this.blocksService.getBlockedUsers(user.id);
  }
}
