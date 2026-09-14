import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  findByUsername(username: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { username } });
  }

  findManyByUserIds(userIds: string[]): Promise<Profile[]> {
    return this.prisma.profile.findMany({ where: { userId: { in: userIds } } });
  }

  create(data: {
    userId: string;
    username: string;
    displayName: string;
  }): Promise<Profile> {
    return this.prisma.profile.create({ data });
  }

  update(userId: string, data: Partial<Omit<Profile, 'id' | 'userId'>>): Promise<Profile> {
    return this.prisma.profile.update({ where: { userId }, data });
  }

  /**
   * Conteos + relación con el usuario actual para la cabecera de perfil.
   * Se resuelve acá con Prisma directo (no importando FollowsModule) porque
   * FollowsModule ya importa ProfilesModule — importarlo de vuelta crearía
   * una dependencia circular. Mismo criterio que PostsRepository.findLikedPostIds.
   */
  async getFollowStats(
    userId: string,
    currentUserId?: string,
  ): Promise<{ followersCount: number; followingCount: number; isFollowedByCurrentUser: boolean }> {
    const [followersCount, followingCount, followRow] = await Promise.all([
      this.prisma.follow.count({ where: { followeeId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
      currentUserId && currentUserId !== userId
        ? this.prisma.follow.findUnique({
            where: { followerId_followeeId: { followerId: currentUserId, followeeId: userId } },
          })
        : null,
    ]);

    return { followersCount, followingCount, isFollowedByCurrentUser: followRow !== null };
  }
}
