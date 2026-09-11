import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class RecommendationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Usuarios con más seguidores en toda la plataforma — fallback cuando no hay suficientes candidatos por 2do grado. */
  async findMostFollowedUserIds(limit: number): Promise<string[]> {
    const rows = await this.prisma.follow.groupBy({
      by: ['followeeId'],
      _count: { followeeId: true },
      orderBy: { _count: { followeeId: 'desc' } },
      take: limit,
    });
    return rows.map((r) => r.followeeId);
  }

  /** Tecnologías que un usuario ya usa, a partir de sus propios posts (no hay tabla user_technologies poblada todavía). */
  async findTechnologyIdsUsedByAuthor(authorId: string): Promise<string[]> {
    const rows = await this.prisma.postTechnology.findMany({
      where: { post: { authorId } },
      select: { technologyId: true },
      distinct: ['technologyId'],
    });
    return rows.map((r) => r.technologyId);
  }

  /**
   * Tecnologías más usadas entre un conjunto de autores (ej. gente que
   * seguís), o entre TODOS si no se pasa `authorIds` (fallback global).
   * Dataset acotado con `take` para no escanear la tabla completa —
   * suficiente en esta escala, se revisita si crece mucho.
   */
  async findPopularTechnologies(
    authorIds: string[] | null,
    excludeIds: string[],
    limit: number,
  ): Promise<Array<{ id: string; name: string; slug: string }>> {
    const rows = await this.prisma.postTechnology.findMany({
      where: {
        post: authorIds ? { authorId: { in: authorIds } } : undefined,
        technologyId: { notIn: excludeIds },
      },
      include: { technology: true },
      take: 500,
    });

    const counts = new Map<string, { id: string; name: string; slug: string; count: number }>();
    for (const row of rows) {
      const existing = counts.get(row.technologyId);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(row.technologyId, {
          id: row.technology.id,
          name: row.technology.name,
          slug: row.technology.slug,
          count: 1,
        });
      }
    }

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(({ id, name, slug }) => ({ id, name, slug }));
  }
}
