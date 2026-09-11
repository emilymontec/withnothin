import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

const POST_INCLUDE = {
  author: { include: { profile: true } },
  technologies: { include: { technology: true } },
  tags: { include: { tag: true } },
  media: { include: { mediaAsset: true } },
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.PostInclude;

export { POST_INCLUDE };

export type PostWithRelations = Prisma.PostGetPayload<{ include: typeof POST_INCLUDE }>;

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    authorId: string;
    type: string;
    content: string;
    visibility: string;
    metadata?: Record<string, unknown>;
    technologyIds: string[];
    tagIds: string[];
    mediaAssetIds: string[];
    communityId?: string;
  }): Promise<PostWithRelations> {
    return this.prisma.post.create({
      data: {
        authorId: data.authorId,
        type: data.type,
        content: data.content,
        visibility: data.visibility,
        metadata: data.metadata as Prisma.InputJsonValue,
        communityId: data.communityId,
        technologies: {
          create: data.technologyIds.map((technologyId) => ({ technologyId })),
        },
        tags: {
          create: data.tagIds.map((tagId) => ({ tagId })),
        },
        media: {
          create: data.mediaAssetIds.map((mediaAssetId, order) => ({ mediaAssetId, order })),
        },
      },
      include: POST_INCLUDE,
    });
  }

  findById(id: string): Promise<PostWithRelations | null> {
    return this.prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: POST_INCLUDE,
    });
  }

  /** Usada por la policy y por update/delete — no necesita las relaciones completas. */
  findRawById(id: string): Promise<Post | null> {
    return this.prisma.post.findFirst({ where: { id, deletedAt: null } });
  }

  async findMany(params: {
    cursor?: string;
    limit: number;
    type?: string;
    technologySlug?: string;
    authorId?: string;
    communityId?: string;
  }): Promise<PostWithRelations[]> {
    return this.prisma.post.findMany({
      where: {
        deletedAt: null,
        visibility: 'PUBLIC', // el feed personalizado (seguidores) llega en Fase 5
        type: params.type,
        authorId: params.authorId,
        communityId: params.communityId,
        technologies: params.technologySlug
          ? { some: { technology: { slug: params.technologySlug } } }
          : undefined,
      },
      include: POST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      ...(params.cursor
        ? { cursor: { id: params.cursor }, skip: 1 } // skip para no repetir el registro del cursor
        : {}),
    });
  }

  /**
   * Feed cronológico: posts propios + de los usuarios seguidos.
   * Se excluyen posts PRIVATE ajenos (uno mismo sí ve los propios).
   */
  async findFeedForUser(params: {
    userId: string;
    followeeIds: string[];
    excludeAuthorIds?: string[];
    cursor?: string;
    limit: number;
  }): Promise<PostWithRelations[]> {
    const authorIds = [params.userId, ...params.followeeIds];

    return this.prisma.post.findMany({
      where: {
        deletedAt: null,
        status: 'PUBLISHED',
        authorId: { in: authorIds, notIn: params.excludeAuthorIds },
        NOT: { AND: [{ visibility: 'PRIVATE' }, { authorId: { not: params.userId } }] },
      },
      include: POST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    });
  }

  update(
    id: string,
    data: {
      content?: string;
      visibility?: string;
      metadata?: Record<string, unknown>;
      technologyIds?: string[];
      tagIds?: string[];
    },
  ): Promise<PostWithRelations> {
    return this.prisma.post.update({
      where: { id },
      data: {
        content: data.content,
        visibility: data.visibility,
        metadata: data.metadata as Prisma.InputJsonValue,
        // Si se mandan tecnologías/tags nuevos, se reemplaza el set completo
        // (más simple y predecible que hacer diff incremental).
        ...(data.technologyIds
          ? {
              technologies: {
                deleteMany: {},
                create: data.technologyIds.map((technologyId) => ({ technologyId })),
              },
            }
          : {}),
        ...(data.tagIds
          ? {
              tags: {
                deleteMany: {},
                create: data.tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
      include: POST_INCLUDE,
    });
  }

  softDelete(id: string): Promise<Post> {
    return this.prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
