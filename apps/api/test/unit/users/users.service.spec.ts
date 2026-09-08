import { Test } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { UsersRepository } from '../../../src/modules/users/users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(UsersRepository);
  });

  describe('getOrProvisionFromAuth', () => {
    it('retorna el usuario existente sin crear uno nuevo', async () => {
      const existingUser = { id: 'u1', email: 'a@test.com' } as any;
      repository.findById.mockResolvedValue(existingUser);

      const result = await service.getOrProvisionFromAuth({ id: 'u1', email: 'a@test.com' });

      expect(result).toEqual(existingUser);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('crea el usuario si es su primer request autenticado', async () => {
      repository.findById.mockResolvedValue(null);
      const newUser = { id: 'u2', email: 'nuevo@test.com' } as any;
      repository.create.mockResolvedValue(newUser);

      const result = await service.getOrProvisionFromAuth({
        id: 'u2',
        email: 'nuevo@test.com',
      });

      expect(repository.create).toHaveBeenCalledWith({
        id: 'u2',
        email: 'nuevo@test.com',
      });
      expect(result).toEqual(newUser);
    });
  });
});
