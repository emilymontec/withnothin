import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class BlocksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async block(blockerId: string, blockedId: string): Promise<void> {
    await this.prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: {},
      create: { blockerId, blockedId },
    });
  }

  async unblock(blockerId: string, blockedId: string): Promise<void> {
    await this.prisma.block.deleteMany({ where: { blockerId, blockedId } });
  }

  async existsEitherDirection(userA: string, userB: string): Promise<boolean> {
    const count = await this.prisma.block.count({
      where: {
        OR: [
          { blockerId: userA, blockedId: userB },
          { blockerId: userB, blockedId: userA },
        ],
      },
    });
    return count > 0;
  }

  findBlockedIds(userId: string): Promise<string[]> {
    return this.prisma.block
      .findMany({ where: { blockerId: userId }, select: { blockedId: true } })
      .then((rows) => rows.map((r) => r.blockedId));
  }

  findBlockedByIds(userId: string): Promise<string[]> {
    return this.prisma.block
      .findMany({ where: { blockedId: userId }, select: { blockerId: true } })
      .then((rows) => rows.map((r) => r.blockerId));
  }
}
