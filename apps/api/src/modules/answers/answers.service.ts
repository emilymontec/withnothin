import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AnswersRepository, AnswerWithRelations } from './answers.repository';
import { AnswersPolicy } from './policies/answers.policy';
import { PostsRepository } from '../posts/posts.repository';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerResponseDto } from './dto/answer-response.dto';
import { PostType } from '@withnothin/shared-types';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answersPolicy: AnswersPolicy,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createForPost(postId: string, userId: string, dto: CreateAnswerDto): Promise<AnswerResponseDto> {
    const post = await this.postsRepository.findRawById(postId);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
    if (post.type !== PostType.QUESTION) {
      throw new BadRequestException('Solo se puede responder a posts de tipo QUESTION');
    }

    const answer = await this.answersRepository.create({ postId, authorId: userId, content: dto.content });
    return this.toResponseDto(answer);
  }

  async findByPost(postId: string): Promise<AnswerResponseDto[]> {
    const answers = await this.answersRepository.findByPost(postId);
    return answers.map((a) => this.toResponseDto(a));
  }

  async accept(userId: string, postId: string, answerId: string): Promise<AnswerResponseDto> {
    const post = await this.postsRepository.findRawById(postId);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
    this.answersPolicy.assertCanAccept(post, userId);

    const answer = await this.answersRepository.findRawById(answerId);
    if (!answer || answer.postId !== postId) {
      throw new NotFoundException('Respuesta no encontrada');
    }

    // Solo una respuesta aceptada por pregunta — se desmarca cualquier otra primero.
    await this.answersRepository.unacceptAllForPost(postId);
    await this.answersRepository.markAccepted(answerId);

    const accepted = await this.answersRepository.findByIdWithRelations(answerId);
    if (!accepted) {
      throw new NotFoundException('Respuesta no encontrada');
    }

    return this.toResponseDto(accepted);
  }

  private toResponseDto(answer: AnswerWithRelations): AnswerResponseDto {
    const votesScore = answer.votes.reduce((sum, v) => sum + v.value, 0);

    return new AnswerResponseDto({
      id: answer.id,
      content: answer.content,
      isAccepted: answer.isAccepted,
      votesScore,
      author: {
        id: answer.author.id,
        username: answer.author.profile?.username ?? '',
        displayName: answer.author.profile?.displayName ?? '',
        avatarUrl: answer.author.profile?.avatarUrl ?? null,
      },
      createdAt: answer.createdAt,
    });
  }
}
