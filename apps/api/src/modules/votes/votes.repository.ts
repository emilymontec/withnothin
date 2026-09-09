import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class VotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async vote(userId: string, answerId: string, value: 1 | -1): Promise<void> {
    await this.prisma.vote.upsert({
      where: { userId_answerId: { userId, answerId } },
      update: { value },
      create: { userId, answerId, value },
    });
  }

  async unvote(userId: string, answerId: string): Promise<void> {
    await this.prisma.vote.deleteMany({ where: { userId, answerId } });
  }
}
