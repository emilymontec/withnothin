import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { POST_INCLUDE, PostWithRelations } from '../posts/posts.repository';

@Injectable()
export class SavesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: string, postId: string): Promise<void> {
    await this.prisma.save.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId },
    });
  }

  async unsave(userId: string, postId: string): Promise<void> {
    await this.prisma.save.deleteMany({ where: { userId, postId } });
  }

  async findSavedPostsForUser(
    userId: string,
    cursor: string | undefined,
    limit: number,
  ): Promise<PostWithRelations[]> {
    const saves = await this.prisma.save.findMany({
      where: { userId },
      include: { post: { include: POST_INCLUDE } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { cursor: { userId_postId: { userId, postId: cursor } }, skip: 1 } : {}),
    });

    return saves.map((s) => s.post);
  }
}
