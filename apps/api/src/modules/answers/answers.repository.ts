import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Answer, Prisma } from '@prisma/client';

const ANSWER_INCLUDE = {
  author: { include: { profile: true } },
  votes: true, // dataset pequeño por pregunta — se suma en memoria, ver AnswersService
} satisfies Prisma.AnswerInclude;

export type AnswerWithRelations = Prisma.AnswerGetPayload<{ include: typeof ANSWER_INCLUDE }>;

@Injectable()
export class AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { postId: string; authorId: string; content: string }): Promise<AnswerWithRelations> {
    return this.prisma.answer.create({ data, include: ANSWER_INCLUDE });
  }

  findByPost(postId: string): Promise<AnswerWithRelations[]> {
    return this.prisma.answer.findMany({
      where: { postId, deletedAt: null },
      include: ANSWER_INCLUDE,
      // La aceptada primero, después por antigüedad — igual criterio que Stack Overflow.
      orderBy: [{ isAccepted: 'desc' }, { createdAt: 'asc' }],
    });
  }

  findRawById(id: string): Promise<Answer | null> {
    return this.prisma.answer.findFirst({ where: { id, deletedAt: null } });
  }

  async unacceptAllForPost(postId: string): Promise<void> {
    await this.prisma.answer.updateMany({ where: { postId }, data: { isAccepted: false } });
  }

  markAccepted(id: string): Promise<Answer> {
    return this.prisma.answer.update({ where: { id }, data: { isAccepted: true } });
  }

  findByIdWithRelations(id: string): Promise<AnswerWithRelations | null> {
    return this.prisma.answer.findUnique({ where: { id }, include: ANSWER_INCLUDE });
  }
}
