import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class FollowsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: string, followeeId: string): Promise<void> {
    await this.prisma.follow.upsert({
      where: { followerId_followeeId: { followerId, followeeId } },
      update: {},
      create: { followerId, followeeId },
    });
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    await this.prisma.follow.deleteMany({ where: { followerId, followeeId } });
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId, followeeId } },
    });
    return follow !== null;
  }

  /** IDs de los usuarios a los que sigue `userId` — insumo del feed. */
  async findFolloweeIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });
    return rows.map((r) => r.followeeId);
  }

  /**
   * Igual que findFolloweeIds pero para varios usuarios a la vez —
   * una sola query en vez de N. Usado por RecommendationsService para
   * expandir "gente que sigue la gente que seguís" (2do grado) sin
   * disparar una query secuencial por cada followee.
   */
  async findFolloweeIdsForMany(userIds: string[]): Promise<Map<string, string[]>> {
    if (userIds.length === 0) return new Map();

    const rows = await this.prisma.follow.findMany({
      where: { followerId: { in: userIds } },
      select: { followerId: true, followeeId: true },
    });

    const result = new Map<string, string[]>();
    for (const row of rows) {
      const list = result.get(row.followerId);
      if (list) {
        list.push(row.followeeId);
      } else {
        result.set(row.followerId, [row.followeeId]);
      }
    }
    return result;
  }

  async findFollowerIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followeeId: userId },
      select: { followerId: true },
    });
    return rows.map((r) => r.followerId);
  }

  countFollowers(userId: string): Promise<number> {
    return this.prisma.follow.count({ where: { followeeId: userId } });
  }

  countFollowing(userId: string): Promise<number> {
    return this.prisma.follow.count({ where: { followerId: userId } });
  }
}
