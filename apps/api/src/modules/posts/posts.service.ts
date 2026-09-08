import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository, PostWithRelations } from './posts.repository';
import { PostsPolicy } from './policies/posts.policy';
import { TechnologiesService } from '../technologies/technologies.service';
import { TagsService } from '../tags/tags.service';
import { MediaService } from '../media/media.service';
import { SupabaseStorageService } from '../../shared/storage/supabase-storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostVisibility } from '@withnothin/shared-types';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postsPolicy: PostsPolicy,
    private readonly technologiesService: TechnologiesService,
    private readonly tagsService: TagsService,
    private readonly mediaService: MediaService,
    private readonly storageService: SupabaseStorageService,
  ) {}

  async create(userId: string, dto: CreatePostDto): Promise<PostResponseDto> {
    const [technologies, tags] = await Promise.all([
      this.resolveTechnologyIds(dto.technologies),
      this.resolveTagIds(dto.tags),
    ]);

    const mediaAssets = await this.mediaService.getConfirmedOwnedAssets(
      userId,
      dto.mediaIds ?? [],
    );

    const post = await this.postsRepository.create({
      authorId: userId,
      type: dto.type,
      content: dto.content,
      visibility: dto.visibility ?? PostVisibility.PUBLIC,
      metadata: dto.metadata,
      technologyIds: technologies,
      tagIds: tags,
      mediaAssetIds: mediaAssets.map((a) => a.id),
    });

    return this.toResponseDto(post);
  }

  async findById(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
    return this.toResponseDto(post);
  }

  async findMany(query: FindPostsQueryDto): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.findMany({
      cursor: query.cursor,
      limit: query.limit,
      type: query.type,
      technologySlug: query.technology,
      authorId: query.authorId,
    });
    return posts.map((p) => this.toResponseDto(p));
  }

  async update(userId: string, id: string, dto: UpdatePostDto): Promise<PostResponseDto> {
    const existing = await this.postsRepository.findRawById(id);
    if (!existing) {
      throw new NotFoundException('Post no encontrado');
    }
    this.postsPolicy.assertCanModify(existing, userId);

    const technologyIds = dto.technologies
      ? await this.resolveTechnologyIds(dto.technologies)
      : undefined;
    const tagIds = dto.tags ? await this.resolveTagIds(dto.tags) : undefined;

    const updated = await this.postsRepository.update(id, {
      content: dto.content,
      visibility: dto.visibility,
      metadata: dto.metadata,
      technologyIds,
      tagIds,
    });

    return this.toResponseDto(updated);
  }

  async softDelete(userId: string, id: string): Promise<void> {
    const existing = await this.postsRepository.findRawById(id);
    if (!existing) {
      throw new NotFoundException('Post no encontrado');
    }
    this.postsPolicy.assertCanModify(existing, userId);

    await this.postsRepository.softDelete(id);
  }

  private async resolveTechnologyIds(names?: string[]): Promise<string[]> {
    if (!names || names.length === 0) return [];
    const technologies = await Promise.all(
      names.map((name) => this.technologiesService.findOrCreateByName(name)),
    );
    return technologies.map((t) => t.id);
  }

  private async resolveTagIds(names?: string[]): Promise<string[]> {
    if (!names || names.length === 0) return [];
    const tags = await Promise.all(names.map((name) => this.tagsService.findOrCreateByName(name)));
    return tags.map((t) => t.id);
  }

  toResponseDto(post: PostWithRelations): PostResponseDto {
    return new PostResponseDto({
      id: post.id,
      type: post.type,
      content: post.content,
      status: post.status,
      visibility: post.visibility,
      metadata: post.metadata as Record<string, unknown> | null,
      author: {
        id: post.author.id,
        username: post.author.profile?.username ?? '',
        displayName: post.author.profile?.displayName ?? '',
        avatarUrl: post.author.profile?.avatarUrl ?? null,
      },
      technologies: post.technologies.map((pt) => ({
        id: pt.technology.id,
        name: pt.technology.name,
        slug: pt.technology.slug,
      })),
      tags: post.tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name, slug: pt.tag.slug })),
      media: post.media.map((pm) => ({
        id: pm.mediaAsset.id,
        url: this.storageService.getPublicUrl(pm.mediaAsset.bucketPath),
      })),
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  }
}
