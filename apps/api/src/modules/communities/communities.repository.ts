import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Community, Prisma } from '@prisma/client';

const COMMUNITY_INCLUDE = {
  owner: { include: { profile: true } },
  _count: { select: { members: true } },
} satisfies Prisma.CommunityInclude;

export type CommunityWithRelations = Prisma.CommunityGetPayload<{ include: typeof COMMUNITY_INCLUDE }>;

@Injectable()
export class CommunitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { ownerId: string; slug: string; name: string; description?: string }): Promise<CommunityWithRelations> {
    return this.prisma.community.create({
      data: {
        ownerId: data.ownerId,
        slug: data.slug,
        name: data.name,
        description: data.description,
        // El owner también queda como miembro (role OWNER) — mismo
        // patrón que ProjectMember, ver módulo projects.
        members: { create: { userId: data.ownerId, role: 'OWNER' } },
      },
      include: COMMUNITY_INCLUDE,
    });
  }

  findById(id: string): Promise<CommunityWithRelations | null> {
    return this.prisma.community.findFirst({ where: { id, deletedAt: null }, include: COMMUNITY_INCLUDE });
  }

  findBySlug(slug: string): Promise<CommunityWithRelations | null> {
    return this.prisma.community.findFirst({ where: { slug, deletedAt: null }, include: COMMUNITY_INCLUDE });
  }

  findRawById(id: string): Promise<Community | null> {
    return this.prisma.community.findFirst({ where: { id, deletedAt: null } });
  }

  findMany(params: { cursor?: string; limit: number }): Promise<CommunityWithRelations[]> {
    return this.prisma.community.findMany({
      where: { deletedAt: null },
      include: COMMUNITY_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    });
  }

  update(id: string, data: { name?: string; description?: string }): Promise<CommunityWithRelations> {
    return this.prisma.community.update({ where: { id }, data, include: COMMUNITY_INCLUDE });
  }

  softDelete(id: string): Promise<Community> {
    return this.prisma.community.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async join(communityId: string, userId: string): Promise<void> {
    await this.prisma.communityMember.upsert({
      where: { communityId_userId: { communityId, userId } },
      update: {},
      create: { communityId, userId, role: 'MEMBER' },
    });
  }

  async leave(communityId: string, userId: string): Promise<void> {
    // El owner no puede "leave" por esta vía (no tendría sentido sin
    // transferir ownership) — se filtra explícitamente por rol.
    await this.prisma.communityMember.deleteMany({
      where: { communityId, userId, role: { not: 'OWNER' } },
    });
  }

  async removeMember(communityId: string, userId: string): Promise<void> {
    await this.prisma.communityMember.deleteMany({
      where: { communityId, userId, role: { not: 'OWNER' } },
    });
  }

  findMembers(communityId: string) {
    return this.prisma.communityMember.findMany({
      where: { communityId },
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  isMember(communityId: string, userId: string): Promise<boolean> {
    return this.prisma.communityMember
      .findUnique({ where: { communityId_userId: { communityId, userId } } })
      .then((m) => m !== null);
  }
}
