import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

// Requiere sesión: las sugerencias dependen de a quién seguís.
@ApiTags('recommendations')
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('users')
  suggestUsers(@CurrentUser() user: AuthenticatedUser) {
    return this.recommendationsService.suggestUsersToFollow(user.id);
  }

  @Get('technologies')
  suggestTechnologies(@CurrentUser() user: AuthenticatedUser) {
    return this.recommendationsService.suggestTechnologies(user.id);
  }
}
