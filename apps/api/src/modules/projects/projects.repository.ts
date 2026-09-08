import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Project, Prisma } from '@prisma/client';

const PROJECT_INCLUDE = {
  owner: { include: { profile: true } },
  members: { include: { user: { include: { profile: true } } } },
  technologies: { include: { technology: true } },
  links: true,
} satisfies Prisma.ProjectInclude;

export type ProjectWithRelations = Prisma.ProjectGetPayload<{ include: typeof PROJECT_INCLUDE }>;

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    ownerId: string;
    name: string;
    description?: string;
    technologyIds: string[];
    links: Array<{ label: string; url: string }>;
  }): Promise<ProjectWithRelations> {
    return this.prisma.project.create({
      data: {
        ownerId: data.ownerId,
        name: data.name,
        description: data.description,
        // El owner también queda como fila en ProjectMember (role OWNER)
        // para que listar miembros sea una sola consulta — ver schema.
        members: { create: { userId: data.ownerId, role: 'OWNER' } },
        technologies: { create: data.technologyIds.map((technologyId) => ({ technologyId })) },
        links: { create: data.links },
      },
      include: PROJECT_INCLUDE,
    });
  }

  findById(id: string): Promise<ProjectWithRelations | null> {
    return this.prisma.project.findFirst({ where: { id, deletedAt: null }, include: PROJECT_INCLUDE });
  }

  findRawById(id: string): Promise<Project | null> {
    return this.prisma.project.findFirst({ where: { id, deletedAt: null } });
  }

  findMany(params: {
    cursor?: string;
    limit: number;
    ownerId?: string;
    technologySlug?: string;
  }): Promise<ProjectWithRelations[]> {
    return this.prisma.project.findMany({
      where: {
        deletedAt: null,
        ownerId: params.ownerId,
        technologies: params.technologySlug
          ? { some: { technology: { slug: params.technologySlug } } }
          : undefined,
      },
      include: PROJECT_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    });
  }

  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: string;
      technologyIds?: string[];
      links?: Array<{ label: string; url: string }>;
    },
  ): Promise<ProjectWithRelations> {
    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        ...(data.technologyIds
          ? {
              technologies: {
                deleteMany: {},
                create: data.technologyIds.map((technologyId) => ({ technologyId })),
              },
            }
          : {}),
        ...(data.links
          ? {
              links: {
                deleteMany: {},
                create: data.links,
              },
            }
          : {}),
      },
      include: PROJECT_INCLUDE,
    });
  }

  softDelete(id: string): Promise<Project> {
    return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addMember(projectId: string, userId: string): Promise<void> {
    await this.prisma.projectMember.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: {},
      create: { projectId, userId, role: 'MEMBER' },
    });
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.prisma.projectMember.deleteMany({ where: { projectId, userId, role: { not: 'OWNER' } } });
  }
}
