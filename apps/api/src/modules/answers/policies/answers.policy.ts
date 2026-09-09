import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';

@Injectable()
export class AnswersPolicy {
  /** Solo quien hizo la pregunta puede marcar una respuesta como aceptada. */
  assertCanAccept(post: Post, userId: string): void {
    if (post.authorId !== userId) {
      throw new ForbiddenException('Solo el autor de la pregunta puede aceptar una respuesta');
    }
  }
}
