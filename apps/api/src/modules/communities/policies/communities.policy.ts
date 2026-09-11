import { ForbiddenException, Injectable } from '@nestjs/common';
import { Community } from '@prisma/client';

@Injectable()
export class CommunitiesPolicy {
  /** Editar/borrar la comunidad y gestionar miembros: solo el owner (v1 — sin rol MODERATOR todavía). */
  assertCanManage(community: Community, userId: string): void {
    if (community.ownerId !== userId) {
      throw new ForbiddenException('Solo el dueño de la comunidad puede hacer esto');
    }
  }
}
