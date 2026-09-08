import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BlocksService } from '../../../src/modules/blocks/blocks.service';
import { BlocksRepository } from '../../../src/modules/blocks/blocks.repository';
import { ProfilesService } from '../../../src/modules/profiles/profiles.service';

describe('BlocksService', () => {
  let service: BlocksService;
  let repository: jest.Mocked<BlocksRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: BlocksRepository,
          useValue: {
            block: jest.fn(),
            unblock: jest.fn(),
            existsEitherDirection: jest.fn(),
            findBlockedIds: jest.fn(),
            findBlockedByIds: jest.fn(),
          },
        },
        { provide: ProfilesService, useValue: { findSummariesByUserIds: jest.fn() } },
      ],
    }).compile();

    service = module.get(BlocksService);
    repository = module.get(BlocksRepository);
  });

  it('rechaza bloquearse a uno mismo', async () => {
    await expect(service.block('user-1', 'user-1')).rejects.toThrow(BadRequestException);
    expect(repository.block).not.toHaveBeenCalled();
  });

  it('permite bloquear a otro usuario', async () => {
    await service.block('user-1', 'user-2');
    expect(repository.block).toHaveBeenCalledWith('user-1', 'user-2');
  });

  it('combina bloqueados y bloqueadores sin duplicados', async () => {
    repository.findBlockedIds.mockResolvedValue(['user-2', 'user-3']);
    repository.findBlockedByIds.mockResolvedValue(['user-3', 'user-4']);

    const result = await service.getBlockedEitherDirectionIds('user-1');

    expect(result.sort()).toEqual(['user-2', 'user-3', 'user-4']);
  });
});
