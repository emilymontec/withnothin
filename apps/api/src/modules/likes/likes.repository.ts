import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async like(userId: string, postId: string): Promise<void> {
    // upsert = idempotente: dar like dos veces no falla ni duplica.
    await this.prisma.like.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId },
    });
  }

  async unlike(userId: string, postId: string): Promise<void> {
    await this.prisma.like.deleteMany({ where: { userId, postId } });
  }

  async exists(userId: string, postId: string): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return like !== null;
  }
}
