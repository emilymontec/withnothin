import { Injectable } from '@nestjs/common';
import { RecommendationsRepository } from './recommendations.repository';
import { FollowsService } from '../follows/follows.service';
import { BlocksService } from '../blocks/blocks.service';
import { ProfilesService } from '../profiles/profiles.service';
import { FollowUserResponseDto } from '../follows/dto/follow-user-response.dto';

const DEFAULT_LIMIT = 10;
// Cap para no explotar el costo de la consulta de 2do grado si alguien sigue a miles de personas.
const MAX_FOLLOWEES_TO_EXPAND = 50;

/**
 * Recomendaciones v1: reglas simples, no Machine Learning (ver
 * arquitectura — "versión inicial basada en reglas"). Se revisita con
 * un enfoque más sofisticado solo si hay evidencia de que el
 * cronológico + estas reglas no alcanzan.
 */
@Injectable()
export class RecommendationsService {
  constructor(
    private readonly recommendationsRepository: RecommendationsRepository,
    private readonly followsService: FollowsService,
    private readonly blocksService: BlocksService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Regla: "gente que sigue la gente que seguís" (2do grado), rankeado
   * por cuántos de tus follows la siguen. Si no hay suficientes
   * candidatos (usuario nuevo con pocos follows), se completa con los
   * usuarios más seguidos de la plataforma.
   */
  async suggestUsersToFollow(userId: string, limit = DEFAULT_LIMIT): Promise<FollowUserResponseDto[]> {
    const [followeeIds, blockedIds] = await Promise.all([
      this.followsService.getFolloweeIds(userId),
      this.blocksService.getBlockedEitherDirectionIds(userId),
    ]);

    const excludeIds = new Set([userId, ...followeeIds, ...blockedIds]);
    const counts = new Map<string, number>();

    for (const followeeId of followeeIds.slice(0, MAX_FOLLOWEES_TO_EXPAND)) {
      const secondDegreeIds = await this.followsService.getFolloweeIds(followeeId);
      for (const candidateId of secondDegreeIds) {
        if (excludeIds.has(candidateId)) continue;
        counts.set(candidateId, (counts.get(candidateId) ?? 0) + 1);
      }
    }

    let candidateIds = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, limit);

    if (candidateIds.length < limit) {
      const popularIds = await this.recommendationsRepository.findMostFollowedUserIds(limit * 2);
      for (const id of popularIds) {
        if (candidateIds.length >= limit) break;
        if (excludeIds.has(id) || candidateIds.includes(id)) continue;
        candidateIds.push(id);
      }
    }

    const summaries = await this.profilesService.findSummariesByUserIds(candidateIds);
    // Preserva el orden de relevancia calculado arriba, no el orden de la consulta a perfiles.
    const summaryById = new Map(summaries.map((s) => [s.userId, s]));
    return candidateIds
      .map((id) => summaryById.get(id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
      .map((s) => new FollowUserResponseDto(s));
  }

  /**
   * Regla: tecnologías que usa la gente que seguís y vos todavía no
   * usaste en ningún post. Fallback: tecnologías más populares
   * globalmente si no seguís a nadie todavía.
   */
  async suggestTechnologies(userId: string, limit = DEFAULT_LIMIT) {
    const myTechIds = await this.recommendationsRepository.findTechnologyIdsUsedByAuthor(userId);
    const followeeIds = await this.followsService.getFolloweeIds(userId);

    let suggestions = await this.recommendationsRepository.findPopularTechnologies(
      followeeIds.length > 0 ? followeeIds : null,
      myTechIds,
      limit,
    );

    if (suggestions.length < limit) {
      const globalFallback = await this.recommendationsRepository.findPopularTechnologies(
        null,
        [...myTechIds, ...suggestions.map((s) => s.id)],
        limit - suggestions.length,
      );
      suggestions = [...suggestions, ...globalFallback];
    }

    return suggestions;
  }
}
