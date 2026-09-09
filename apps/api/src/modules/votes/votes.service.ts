import { Injectable, NotFoundException } from '@nestjs/common';
import { VotesRepository } from './votes.repository';
import { AnswersRepository } from '../answers/answers.repository';

@Injectable()
export class VotesService {
  constructor(
    private readonly votesRepository: VotesRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async vote(userId: string, answerId: string, value: 1 | -1): Promise<void> {
    await this.assertAnswerExists(answerId);
    await this.votesRepository.vote(userId, answerId, value);
  }

  async unvote(userId: string, answerId: string): Promise<void> {
    await this.assertAnswerExists(answerId);
    await this.votesRepository.unvote(userId, answerId);
  }

  private async assertAnswerExists(answerId: string): Promise<void> {
    const answer = await this.answersRepository.findRawById(answerId);
    if (!answer) {
      throw new NotFoundException('Respuesta no encontrada');
    }
  }
}
