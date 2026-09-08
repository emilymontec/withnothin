import { ForbiddenException, Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsPolicy {
  /** Editar/borrar el proyecto y sus links/tecnologías: solo el owner. */
  assertCanModify(project: Project, userId: string): void {
    if (project.ownerId !== userId) {
      throw new ForbiddenException('No puedes modificar un proyecto de otro usuario');
    }
  }

  /** Agregar/quitar miembros: solo el owner (evita que un miembro se autopromueva o eche a otros). */
  assertCanManageMembers(project: Project, userId: string): void {
    if (project.ownerId !== userId) {
      throw new ForbiddenException('Solo el dueño del proyecto puede gestionar miembros');
    }
  }
}
