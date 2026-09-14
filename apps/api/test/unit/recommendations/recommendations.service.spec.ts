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
          useValue: {
            findMostFollowedUserIds: jest.fn(),
            findTechnologyIdsUsedByAuthor: jest.fn(),
            findPopularTechnologies: jest.fn(),
          },
        },
        {
          provide: FollowsService,
          useValue: { getFolloweeIds: jest.fn(), getFolloweeIdsForMany: jest.fn() },
        },
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
    followsService.getFolloweeIds.mockResolvedValue(['A', 'B']);
    followsService.getFolloweeIdsForMany.mockResolvedValue(
      new Map([
        ['A', ['X', 'Y']],
        ['B', ['X']],
      ]),
    );
    profilesService.findSummariesByUserIds.mockImplementation((ids: string[]) =>
      Promise.resolve(ids.map((id) => ({ userId: id, username: id, displayName: id, avatarUrl: null }))),
    );
    repository.findMostFollowedUserIds.mockResolvedValue([]);

    const result = await service.suggestUsersToFollow('user-1', 5);

    expect(result[0].userId).toBe('X');
    expect(result[1].userId).toBe('Y');
  });

  it('excluye usuarios ya seguidos y a uno mismo de las sugerencias', async () => {
    followsService.getFolloweeIds.mockResolvedValue(['A']);
    // A "sugiere de vuelta" al propio user-1 y a sí mismo — deben filtrarse.
    followsService.getFolloweeIdsForMany.mockResolvedValue(new Map([['A', ['user-1', 'A']]]));
    profilesService.findSummariesByUserIds.mockResolvedValue([]);
    repository.findMostFollowedUserIds.mockResolvedValue([]);

    const result = await service.suggestUsersToFollow('user-1', 5);

    expect(result).toEqual([]);
  });

  it('expande a 2do grado con UNA sola llamada batched, no una por followee', async () => {
    // Antes: un for...of con await adentro llamaba getFolloweeIds() una
    // vez por cada followee (hasta 50 round-trips secuenciales a la DB
    // para una sola respuesta HTTP) — ver AUDITORIA-fase12.md.
    const followeeIds = ['a', 'b', 'c'];
    followsService.getFolloweeIds.mockResolvedValue(followeeIds);
    followsService.getFolloweeIdsForMany.mockResolvedValue(
      new Map([
        ['a', ['x', 'y']],
        ['b', ['x']],
        ['c', []],
      ]),
    );
    profilesService.findSummariesByUserIds.mockResolvedValue([]);
    repository.findMostFollowedUserIds.mockResolvedValue([]);

    await service.suggestUsersToFollow('user-1');

    expect(followsService.getFolloweeIdsForMany).toHaveBeenCalledTimes(1);
    expect(followsService.getFolloweeIdsForMany).toHaveBeenCalledWith(followeeIds);
    expect(followsService.getFolloweeIds).toHaveBeenCalledTimes(1); // solo para el propio user-1
  });
});
