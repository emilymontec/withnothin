import { Test } from '@nestjs/testing';
import { RecommendationsService } from '../../../src/modules/recommendations/recommendations.service';
import { RecommendationsRepository } from '../../../src/modules/recommendations/recommendations.repository';
import { FollowsService } from '../../../src/modules/follows/follows.service';
import { BlocksService } from '../../../src/modules/blocks/blocks.service';
import { ProfilesService } from '../../../src/modules/profiles/profiles.service';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let followsService: jest.Mocked<FollowsService>;
  let repository: jest.Mocked<RecommendationsRepository>;
  let profilesService: jest.Mocked<ProfilesService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: RecommendationsRepository,
          useValue: { findMostFollowedUserIds: jest.fn(), findTechnologyIdsUsedByAuthor: jest.fn(), findPopularTechnologies: jest.fn() },
        },
        { provide: FollowsService, useValue: { getFolloweeIds: jest.fn() } },
        { provide: BlocksService, useValue: { getBlockedEitherDirectionIds: jest.fn().mockResolvedValue([]) } },
        { provide: ProfilesService, useValue: { findSummariesByUserIds: jest.fn() } },
      ],
    }).compile();

    service = module.get(RecommendationsService);
    followsService = module.get(FollowsService);
    repository = module.get(RecommendationsRepository);
    profilesService = module.get(ProfilesService);
  });

  it('rankea candidatos de 2do grado por cuántos follows los siguen', async () => {
    // user-1 sigue a A y B. A sigue a X e Y. B sigue a X.
    // X debería rankear primero (2 menciones), Y segundo (1 mención).
    followsService.getFolloweeIds.mockImplementation((id: string) => {
      if (id === 'user-1') return Promise.resolve(['A', 'B']);
      if (id === 'A') return Promise.resolve(['X', 'Y']);
      if (id === 'B') return Promise.resolve(['X']);
      return Promise.resolve([]);
    });
    profilesService.findSummariesByUserIds.mockImplementation((ids: string[]) =>
      Promise.resolve(ids.map((id) => ({ userId: id, username: id, displayName: id, avatarUrl: null }))),
    );
    repository.findMostFollowedUserIds.mockResolvedValue([]);

    const result = await service.suggestUsersToFollow('user-1', 5);

    expect(result[0].userId).toBe('X');
    expect(result[1].userId).toBe('Y');
  });

  it('excluye usuarios ya seguidos y a uno mismo de las sugerencias', async () => {
    followsService.getFolloweeIds.mockImplementation((id: string) => {
      if (id === 'user-1') return Promise.resolve(['A']);
      if (id === 'A') return Promise.resolve(['user-1', 'A']); // se sugiere a sí mismo y de vuelta al usuario — deben filtrarse
      return Promise.resolve([]);
    });
    profilesService.findSummariesByUserIds.mockResolvedValue([]);
    repository.findMostFollowedUserIds.mockResolvedValue([]);

    const result = await service.suggestUsersToFollow('user-1', 5);

    expect(result).toEqual([]);
  });
});
