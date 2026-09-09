import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersRepository } from './answers.repository';
import { AnswersPolicy } from './policies/answers.policy';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [AnswersController],
  providers: [AnswersService, AnswersRepository, AnswersPolicy],
  exports: [AnswersRepository], // VotesModule verifica que la respuesta exista
})
export class AnswersModule {}
