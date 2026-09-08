import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts/posts.repository';
import { PostsService } from '../posts/posts.service';
import { FollowsService } from '../follows/follows.service';
import { BlocksService } from '../blocks/blocks.service';
import { MutesService } from '../mutes/mutes.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';

/**
 * El feed NO tiene tabla propia ni entidad propia: es una vista
 * calculada en el momento a partir de Follows + Posts. Empieza
 * cronológico y simple a propósito (ver arquitectura, decisiones
 * pendientes) — un algoritmo de ranking se evalúa recién si el
 * cronológico deja de ser suficiente.
 *
 * Desde la Fase 8 también filtra contenido de usuarios bloqueados
 * (en ambas direcciones) y silenciados (solo desde el punto de vista
 * de quien silencia) — moderación mínima aplicada donde más se nota.
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postsService: PostsService,
    private readonly followsService: FollowsService,
    private readonly blocksService: BlocksService,
    private readonly mutesService: MutesService,
  ) {}

  async getFeedForUser(userId: string, cursor: string | undefined, limit: number): Promise<PostResponseDto[]> {
    const [followeeIds, blockedIds, mutedIds] = await Promise.all([
      this.followsService.getFolloweeIds(userId),
      this.blocksService.getBlockedEitherDirectionIds(userId),
      this.mutesService.getMutedIds(userId),
    ]);

    const posts = await this.postsRepository.findFeedForUser({
      userId,
      followeeIds,
      excludeAuthorIds: [...new Set([...blockedIds, ...mutedIds])],
      cursor,
      limit,
    });

    return posts.map((p) => this.postsService.toResponseDto(p));
  }
}
