import { Test } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { FollowsService } from '../../../src/modules/follows/follows.service';
import { FollowsRepository } from '../../../src/modules/follows/follows.repository';
import { UsersService } from '../../../src/modules/users/users.service';
import { ProfilesService } from '../../../src/modules/profiles/profiles.service';
import { NotificationsService } from '../../../src/modules/notifications/notifications.service';
import { BlocksService } from '../../../src/modules/blocks/blocks.service';

describe('FollowsService', () => {
  let service: FollowsService;
  let repository: jest.Mocked<FollowsRepository>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: FollowsRepository,
          useValue: { follow: jest.fn(), unfollow: jest.fn(), findFolloweeIds: jest.fn() },
        },
        { provide: UsersService, useValue: { findById: jest.fn() } },
        { provide: ProfilesService, useValue: { findSummariesByUserIds: jest.fn() } },
        { provide: NotificationsService, useValue: { notify: jest.fn() } },
        { provide: BlocksService, useValue: { isBlockedEitherDirection: jest.fn().mockResolvedValue(false) } },
      ],
    }).compile();

    service = module.get(FollowsService);
    repository = module.get(FollowsRepository);
    usersService = module.get(UsersService);
  });

  it('rechaza seguirse a uno mismo', async () => {
    await expect(service.follow('user-1', 'user-1')).rejects.toThrow(BadRequestException);
    expect(repository.follow).not.toHaveBeenCalled();
  });

  it('permite seguir a otro usuario existente', async () => {
    usersService.findById.mockResolvedValue({ id: 'user-2' } as any);

    await service.follow('user-1', 'user-2');

    expect(repository.follow).toHaveBeenCalledWith('user-1', 'user-2');
  });

  it('rechaza seguir a un usuario bloqueado (en cualquier dirección)', async () => {
    const module = await Test.createTestingModule({
      providers: [
        FollowsService,
        { provide: FollowsRepository, useValue: { follow: jest.fn() } },
        { provide: UsersService, useValue: { findById: jest.fn().mockResolvedValue({ id: 'user-2' }) } },
        { provide: ProfilesService, useValue: {} },
        { provide: NotificationsService, useValue: { notify: jest.fn() } },
        { provide: BlocksService, useValue: { isBlockedEitherDirection: jest.fn().mockResolvedValue(true) } },
      ],
    }).compile();

    const blockedService = module.get(FollowsService);
    const blockedRepository = module.get(FollowsRepository);

    await expect(blockedService.follow('user-1', 'user-2')).rejects.toThrow(ForbiddenException);
    expect(blockedRepository.follow).not.toHaveBeenCalled();
  });
});
