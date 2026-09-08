import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { PostsService } from '../posts/posts.service';
import { TechnologiesService } from '../technologies/technologies.service';
import { SearchResultsDto } from './dto/search-results.dto';
import type { SearchType } from './dto/search-query.dto';

const DEFAULT_LIMIT_PER_CATEGORY = 10;

@Injectable()
export class SearchService {
  constructor(
    private readonly searchRepository: SearchRepository,
    private readonly postsService: PostsService,
    private readonly technologiesService: TechnologiesService,
  ) {}

  async search(query: string, type: SearchType = 'all'): Promise<SearchResultsDto> {
    const wantsPosts = type === 'all' || type === 'posts';
    const wantsProfiles = type === 'all' || type === 'profiles';
    const wantsTechnologies = type === 'all' || type === 'technologies';

    const [posts, profiles, technologies] = await Promise.all([
      wantsPosts ? this.searchRepository.searchPosts(query, DEFAULT_LIMIT_PER_CATEGORY) : null,
      wantsProfiles ? this.searchRepository.searchProfiles(query, DEFAULT_LIMIT_PER_CATEGORY) : null,
      wantsTechnologies ? this.technologiesService.findAll(query) : null,
    ]);

    return new SearchResultsDto({
      posts: posts?.map((p) => this.postsService.toResponseDto(p)),
      profiles: profiles?.map((p) => ({
        userId: p.userId,
        username: p.username,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
      })),
      technologies: technologies?.map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
    });
  }
}
