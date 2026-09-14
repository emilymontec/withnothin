import { Test } from '@nestjs/testing';
import { PostsService } from '../../../src/modules/posts/posts.service';
import { PostsRepository } from '../../../src/modules/posts/posts.repository';
import { PostsPolicy } from '../../../src/modules/posts/policies/posts.policy';
import { TechnologiesService } from '../../../src/modules/technologies/technologies.service';
import { TagsService } from '../../../src/modules/tags/tags.service';
import { MediaService } from '../../../src/modules/media/media.service';
import { CommunitiesService } from '../../../src/modules/communities/communities.service';
import { SupabaseStorageService } from '../../../src/shared/storage/supabase-storage.service';

function fakePost(id: string) {
  return {
    id,
    type: 'BUILD',
    content: 'hola',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    metadata: null,
    author: { id: 'author-1', profile: { username: 'ana', displayName: 'Ana', avatarUrl: null } },
    technologies: [],
    tags: [],
    media: [],
    _count: { likes: 0, comments: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;
}

describe('PostsService — isLikedByCurrentUser', () => {
  let service: PostsService;
  let repository: jest.Mocked<PostsRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            findById: jest.fn(),
            findMany: jest.fn(),
            findLikedPostIds: jest.fn(),
          },
        },
        { provide: PostsPolicy, useValue: {} },
        { provide: TechnologiesService, useValue: {} },
        { provide: TagsService, useValue: {} },
        { provide: MediaService, useValue: {} },
        { provide: CommunitiesService, useValue: {} },
        { provide: SupabaseStorageService, useValue: { getPublicUrl: jest.fn() } },
      ],
    }).compile();

    service = module.get(PostsService);
    repository = module.get(PostsRepository);
  });

  it('findById sin usuario (visitante anónimo) devuelve isLikedByCurrentUser=false sin consultar likes', async () => {
    repository.findById.mockResolvedValue(fakePost('post-1'));

    const result = await service.findById('post-1');

    expect(result.isLikedByCurrentUser).toBe(false);
    expect(repository.findLikedPostIds).not.toHaveBeenCalled();
  });

  it('findById con usuario que likeó el post devuelve isLikedByCurrentUser=true', async () => {
    repository.findById.mockResolvedValue(fakePost('post-1'));
    repository.findLikedPostIds.mockResolvedValue(new Set(['post-1']));

    const result = await service.findById('post-1', 'user-1');

    expect(repository.findLikedPostIds).toHaveBeenCalledWith('user-1', ['post-1']);
    expect(result.isLikedByCurrentUser).toBe(true);
  });

  it('findMany marca solo los posts likeados por el usuario actual, no todos', async () => {
    repository.findMany.mockResolvedValue([fakePost('post-1'), fakePost('post-2')]);
    repository.findLikedPostIds.mockResolvedValue(new Set(['post-2']));

    const results = await service.findMany({ limit: 10 } as any, 'user-1');

    expect(results.find((p) => p.id === 'post-1')?.isLikedByCurrentUser).toBe(false);
    expect(results.find((p) => p.id === 'post-2')?.isLikedByCurrentUser).toBe(true);
  });
});
