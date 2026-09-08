import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { PostsRepository } from '../posts/posts.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@withnothin/shared-types';
import { Post } from '@prisma/client';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly postsRepository: PostsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async like(userId: string, postId: string): Promise<void> {
    const post = await this.assertPostExists(postId);
    await this.likesRepository.like(userId, postId);

    await this.notificationsService.notify({
      userId: post.authorId,
      type: NotificationType.LIKE,
      payload: { postId, actorId: userId },
      skipIfActorIsRecipient: { actorId: userId },
    });
  }

  async unlike(userId: string, postId: string): Promise<void> {
    await this.assertPostExists(postId);
    await this.likesRepository.unlike(userId, postId);
    // Sin notificación al quitar el like — no tiene valor informativo.
  }

  private async assertPostExists(postId: string): Promise<Post> {
    const post = await this.postsRepository.findRawById(postId);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
    return post;
  }
}
