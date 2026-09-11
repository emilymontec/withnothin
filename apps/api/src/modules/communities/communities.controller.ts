import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CursorPaginationDto } from '../../common/pagination/pagination.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @ApiBearerAuth()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCommunityDto) {
    return this.communitiesService.create(user.id, dto);
  }

  @Public()
  @Get()
  findMany(@Query() query: CursorPaginationDto) {
    return this.communitiesService.findMany(query.cursor, query.limit);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.communitiesService.findById(id);
  }

  // Ruta separada de :id para no colisionar con búsqueda por uuid —
  // mismo patrón que /profiles/:username (slugs son para humanos, ids para el sistema).
  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.communitiesService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCommunityDto,
  ) {
    return this.communitiesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.communitiesService.softDelete(user.id, id);
  }

  @Post(':id/join')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async join(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.communitiesService.join(id, user.id);
  }

  @Delete(':id/join')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.communitiesService.leave(id, user.id);
  }

  @Public()
  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.communitiesService.getMembers(id);
  }

  @Delete(':id/members/:userId')
  @ApiBearerAuth()
  async removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') communityId: string,
    @Param('userId') memberId: string,
  ) {
    await this.communitiesService.removeMember(user.id, communityId, memberId);
  }
}
