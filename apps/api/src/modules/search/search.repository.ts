import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { POST_INCLUDE, PostWithRelations } from '../posts/posts.repository';
import { Profile } from '@prisma/client';

/**
 * Búsqueda simple sobre PostgreSQL (`ILIKE`, vía `contains` + `mode:
 * 'insensitive'` de Prisma) — ver arquitectura, sección 13/decisiones:
 * un search engine dedicado (Meilisearch/Typesense) se evalúa solo si
 * este enfoque deja de ser suficiente en volumen o relevancia.
 */
@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  searchPosts(query: string, limit: number): Promise<PostWithRelations[]> {
    return this.prisma.post.findMany({
      where: {
        deletedAt: null,
        status: 'PUBLISHED',
        visibility: 'PUBLIC', // la búsqueda no filtra por sesión — solo contenido público
        content: { contains: query, mode: 'insensitive' },
      },
      include: POST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  searchProfiles(query: string, limit: number): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }
}
