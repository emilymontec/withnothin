import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('votes')
@ApiBearerAuth()
@Controller('answers/:answerId/votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async vote(
    @CurrentUser() user: AuthenticatedUser,
    @Param('answerId') answerId: string,
    @Body() dto: CreateVoteDto,
  ) {
    await this.votesService.vote(user.id, answerId, dto.value);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unvote(@CurrentUser() user: AuthenticatedUser, @Param('answerId') answerId: string) {
    await this.votesService.unvote(user.id, answerId);
  }
}
