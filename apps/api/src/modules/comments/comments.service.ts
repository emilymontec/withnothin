import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository, CommentWithAuthor } from './comments.repository';
import { PostsRepository } from '../posts/posts.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@withnothin/shared-types';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createForPost(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const post = await this.postsRepository.findRawById(postId);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    const comment = await this.commentsRepository.create({
      postId,
      authorId: userId,
      content: dto.content,
      parentCommentId: dto.parentCommentId,
    });

    await this.notificationsService.notify({
      userId: post.authorId,
      type: NotificationType.COMMENT,
      payload: { postId, commentId: comment.id, actorId: userId },
      skipIfActorIsRecipient: { actorId: userId },
    });

    return this.toResponseDto(comment);
  }

  async findByPost(postId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentsRepository.findByPost(postId);
    return comments.map((c) => this.toResponseDto(c));
  }

  async softDelete(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentsRepository.findRawById(commentId);
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    if (comment.authorId !== userId) {
      // TODO (Fase 8): permitir también a moderadores/admins.
      throw new ForbiddenException('No puedes borrar un comentario de otro usuario');
    }
    await this.commentsRepository.softDelete(commentId);
  }

  private toResponseDto(comment: CommentWithAuthor): CommentResponseDto {
    const isDeleted = comment.deletedAt !== null;

    return new CommentResponseDto({
      id: comment.id,
      content: isDeleted ? '[eliminado]' : comment.content,
      parentCommentId: comment.parentCommentId,
      isDeleted,
      author: isDeleted
        ? null
        : {
            id: comment.author.id,
            username: comment.author.profile?.username ?? '',
            displayName: comment.author.profile?.displayName ?? '',
            avatarUrl: comment.author.profile?.avatarUrl ?? null,
          },
      createdAt: comment.createdAt,
    });
  }
}
