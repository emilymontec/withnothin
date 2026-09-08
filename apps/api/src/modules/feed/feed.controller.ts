import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

// El feed SÍ requiere sesión (a diferencia de GET /posts): depende
// de a quién sigue el usuario autenticado.
@ApiTags('feed')
@ApiBearerAuth()
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@CurrentUser() user: AuthenticatedUser, @Query() query: FeedQueryDto) {
    return this.feedService.getFeedForUser(user.id, query.cursor, query.limit);
  }
}
