import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SavesService } from './saves.service';
import { FindSavesQueryDto } from './dto/find-saves-query.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('saves')
@ApiBearerAuth()
@Controller()
export class SavesController {
  constructor(private readonly savesService: SavesService) {}

  @Post('posts/:postId/saves')
  @HttpCode(HttpStatus.NO_CONTENT)
  async save(@CurrentUser() user: AuthenticatedUser, @Param('postId') postId: string) {
    await this.savesService.save(user.id, postId);
  }

  @Delete('posts/:postId/saves')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsave(@CurrentUser() user: AuthenticatedUser, @Param('postId') postId: string) {
    await this.savesService.unsave(user.id, postId);
  }

  // "Mis guardados" — inherentemente scoped al usuario, como /profiles/me.
  @Get('saves')
  findMine(@CurrentUser() user: AuthenticatedUser, @Query() query: FindSavesQueryDto) {
    return this.savesService.findMySaves(user.id, query.cursor, query.limit);
  }
}
