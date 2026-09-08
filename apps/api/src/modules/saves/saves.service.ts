import { Injectable, NotFoundException } from '@nestjs/common';
import { SavesRepository } from './saves.repository';
import { PostsRepository } from '../posts/posts.repository';
import { PostsService } from '../posts/posts.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@Injectable()
export class SavesService {
  constructor(
    private readonly savesRepository: SavesRepository,
    private readonly postsRepository: PostsRepository,
    private readonly postsService: PostsService,
  ) {}

  async save(userId: string, postId: string): Promise<void> {
    await this.assertPostExists(postId);
    await this.savesRepository.save(userId, postId);
  }

  async unsave(userId: string, postId: string): Promise<void> {
    await this.savesRepository.unsave(userId, postId);
  }

  async findMySaves(
    userId: string,
    cursor: string | undefined,
    limit: number,
  ): Promise<PostResponseDto[]> {
    const posts = await this.savesRepository.findSavedPostsForUser(userId, cursor, limit);
    return posts.map((p) => this.postsService.toResponseDto(p));
  }

  private async assertPostExists(postId: string): Promise<void> {
    const post = await this.postsRepository.findRawById(postId);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
  }
}
