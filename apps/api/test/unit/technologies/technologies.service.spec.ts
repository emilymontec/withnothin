import { Test } from '@nestjs/testing';
import { TechnologiesService } from '../../../src/modules/technologies/technologies.service';
import { TechnologiesRepository } from '../../../src/modules/technologies/technologies.repository';

describe('TechnologiesService', () => {
  let service: TechnologiesService;
  let repository: jest.Mocked<TechnologiesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TechnologiesService,
        {
          provide: TechnologiesRepository,
          useValue: {
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            upsertBySlug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TechnologiesService);
    repository = module.get(TechnologiesRepository);
  });

  it('findOrCreateByName usa upsert atómico por slug, no find-then-create', async () => {
    // Antes de este fix, dos llamadas concurrentes con el mismo nombre
    // (find en null + create) chocaban contra el @unique de slug y
    // devolvían un 500 en vez de resolverse — ver AUDITORIA-fase12.md.
    repository.upsertBySlug.mockResolvedValue({
      id: 'tech-1',
      name: 'Kotlin',
      slug: 'kotlin',
      category: null,
      createdAt: new Date(),
    } as any);

    const result = await service.findOrCreateByName('Kotlin');

    expect(repository.upsertBySlug).toHaveBeenCalledWith({ name: 'Kotlin', slug: 'kotlin' });
    expect(repository.findBySlug).not.toHaveBeenCalled();
    expect(result.slug).toBe('kotlin');
  });

  it('normaliza el nombre (trim) antes de persistir', async () => {
    repository.upsertBySlug.mockResolvedValue({} as any);

    await service.findOrCreateByName('  React  ');

    expect(repository.upsertBySlug).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'React' }),
    );
  });
});
