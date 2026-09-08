import { ForbiddenException } from '@nestjs/common';
import { ProjectsPolicy } from '../../../src/modules/projects/policies/projects.policy';
import { Project } from '@prisma/client';

describe('ProjectsPolicy', () => {
  let policy: ProjectsPolicy;

  beforeEach(() => {
    policy = new ProjectsPolicy();
  });

  it('permite modificar si el usuario es el owner', () => {
    const project = { ownerId: 'user-1' } as Project;
    expect(() => policy.assertCanModify(project, 'user-1')).not.toThrow();
  });

  it('rechaza modificar si el usuario NO es el owner', () => {
    const project = { ownerId: 'user-1' } as Project;
    expect(() => policy.assertCanModify(project, 'user-2')).toThrow(ForbiddenException);
  });

  it('rechaza gestionar miembros si el usuario no es el owner', () => {
    const project = { ownerId: 'user-1' } as Project;
    expect(() => policy.assertCanManageMembers(project, 'user-2')).toThrow(ForbiddenException);
  });
});
