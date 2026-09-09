import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('answers')
@Controller('posts/:postId/answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.answersService.createForPost(postId, user.id, dto);
  }

  @Public()
  @Get()
  findByPost(@Param('postId') postId: string) {
    return this.answersService.findByPost(postId);
  }

  @Patch(':answerId/accept')
  @ApiBearerAuth()
  accept(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
    @Param('answerId') answerId: string,
  ) {
    return this.answersService.accept(user.id, postId, answerId);
  }
}
