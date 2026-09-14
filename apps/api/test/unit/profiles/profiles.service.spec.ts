import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfilesService } from '../../../src/modules/profiles/profiles.service';
import { ProfilesRepository } from '../../../src/modules/profiles/profiles.repository';

function fakeProfile() {
  return {
    userId: 'user-2',
    username: 'ana',
    displayName: 'Ana',
    bio: null,
    avatarUrl: null,
    headline: null,
    location: null,
    createdAt: new Date(),
  } as any;
}

describe('ProfilesService — follow stats', () => {
  let service: ProfilesService;
  let repository: jest.Mocked<ProfilesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfilesRepository,
          useValue: {
            findByUserId: jest.fn(),
            findByUsername: jest.fn(),
            getFollowStats: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProfilesService);
    repository = module.get(ProfilesRepository);
  });

  it('findByUsername expone followersCount/followingCount/isFollowedByCurrentUser', async () => {
    repository.findByUsername.mockResolvedValue(fakeProfile());
    repository.getFollowStats.mockResolvedValue({
      followersCount: 12,
      followingCount: 3,
      isFollowedByCurrentUser: true,
    });

    const result = await service.findByUsername('ana', 'user-1');

    expect(repository.getFollowStats).toHaveBeenCalledWith('user-2', 'user-1');
    expect(result.followersCount).toBe(12);
    expect(result.followingCount).toBe(3);
    expect(result.isFollowedByCurrentUser).toBe(true);
  });

  it('findByUsername sin usuario autenticado no marca al visitante como que sigue al perfil', async () => {
    repository.findByUsername.mockResolvedValue(fakeProfile());
    repository.getFollowStats.mockResolvedValue({
      followersCount: 12,
      followingCount: 3,
      isFollowedByCurrentUser: false,
    });

    const result = await service.findByUsername('ana');

    expect(repository.getFollowStats).toHaveBeenCalledWith('user-2', undefined);
    expect(result.isFollowedByCurrentUser).toBe(false);
  });

  it('lanza NotFoundException si el perfil no existe', async () => {
    repository.findByUsername.mockResolvedValue(null);

    await expect(service.findByUsername('inexistente')).rejects.toThrow(NotFoundException);
  });
});
