import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';

/**
 * Aislar esta regla en su propia clase (en vez de inline en el service)
 * porque va a crecer: hoy es "solo el autor", pronto será "el autor O
 * un moderador/admin" (Fase 8 — Moderación), y las reglas de negocio
 * de quién puede hacer qué no deberían mezclarse con la orquestación
 * de casos de uso.
 */
@Injectable()
export class PostsPolicy {
  assertCanModify(post: Post, userId: string): void {
    if (post.authorId !== userId) {
      // TODO (Fase 8): permitir también a moderadores/admins.
      throw new ForbiddenException('No puedes modificar un post de otro usuario');
    }
  }
}
