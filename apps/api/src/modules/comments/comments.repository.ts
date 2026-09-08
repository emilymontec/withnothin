import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Comment, Prisma } from '@prisma/client';

const COMMENT_INCLUDE = {
  author: { include: { profile: true } },
} satisfies Prisma.CommentInclude;

export type CommentWithAuthor = Prisma.CommentGetPayload<{ include: typeof COMMENT_INCLUDE }>;

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    postId: string;
    authorId: string;
    content: string;
    parentCommentId?: string;
  }): Promise<CommentWithAuthor> {
    return this.prisma.comment.create({ data, include: COMMENT_INCLUDE });
  }

  findByPost(postId: string): Promise<CommentWithAuthor[]> {
    // Sin paginación cursor propia todavía: los hilos de comentarios
    // rara vez superan un volumen que la justifique en esta etapa.
    // Se revisita si algún post concentra cientos de comentarios.
    return this.prisma.comment.findMany({
      where: { postId },
      include: COMMENT_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  findRawById(id: string): Promise<Comment | null> {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  softDelete(id: string): Promise<Comment> {
    return this.prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
