import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository, ProjectWithRelations } from './projects.repository';
import { ProjectsPolicy } from './policies/projects.policy';
import { TechnologiesService } from '../technologies/technologies.service';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindProjectsQueryDto } from './dto/find-projects-query.dto';
import { ProjectResponseDto } from './dto/project-response.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectsPolicy: ProjectsPolicy,
    private readonly technologiesService: TechnologiesService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateProjectDto): Promise<ProjectResponseDto> {
    const technologyIds = await this.resolveTechnologyIds(dto.technologies);

    const project = await this.projectsRepository.create({
      ownerId: userId,
      name: dto.name,
      description: dto.description,
      technologyIds,
      links: dto.links ?? [],
    });

    return this.toResponseDto(project);
  }

  async findById(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectsRepository.findById(id);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return this.toResponseDto(project);
  }

  async findMany(query: FindProjectsQueryDto): Promise<ProjectResponseDto[]> {
    const projects = await this.projectsRepository.findMany({
      cursor: query.cursor,
      limit: query.limit,
      ownerId: query.ownerId,
      technologySlug: query.technology,
    });
    return projects.map((p) => this.toResponseDto(p));
  }

  async update(userId: string, id: string, dto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const existing = await this.projectsRepository.findRawById(id);
    if (!existing) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.projectsPolicy.assertCanModify(existing, userId);

    const technologyIds = dto.technologies ? await this.resolveTechnologyIds(dto.technologies) : undefined;

    const updated = await this.projectsRepository.update(id, {
      name: dto.name,
      description: dto.description,
      status: dto.status,
      technologyIds,
      links: dto.links,
    });

    return this.toResponseDto(updated);
  }

  async softDelete(userId: string, id: string): Promise<void> {
    const existing = await this.projectsRepository.findRawById(id);
    if (!existing) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.projectsPolicy.assertCanModify(existing, userId);

    await this.projectsRepository.softDelete(id);
  }

  async addMember(userId: string, projectId: string, newMemberId: string): Promise<ProjectResponseDto> {
    const project = await this.projectsRepository.findRawById(projectId);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.projectsPolicy.assertCanManageMembers(project, userId);

    // Lanza NotFoundException si el usuario a agregar no existe.
    await this.usersService.findById(newMemberId);

    await this.projectsRepository.addMember(projectId, newMemberId);
    return this.findById(projectId);
  }

  async removeMember(userId: string, projectId: string, memberId: string): Promise<ProjectResponseDto> {
    const project = await this.projectsRepository.findRawById(projectId);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.projectsPolicy.assertCanManageMembers(project, userId);

    await this.projectsRepository.removeMember(projectId, memberId);
    return this.findById(projectId);
  }

  private async resolveTechnologyIds(names?: string[]): Promise<string[]> {
    if (!names || names.length === 0) return [];
    const technologies = await Promise.all(
      names.map((name) => this.technologiesService.findOrCreateByName(name)),
    );
    return technologies.map((t) => t.id);
  }

  private toResponseDto(project: ProjectWithRelations): ProjectResponseDto {
    return new ProjectResponseDto({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      owner: {
        id: project.owner.id,
        username: project.owner.profile?.username ?? '',
        displayName: project.owner.profile?.displayName ?? '',
        avatarUrl: project.owner.profile?.avatarUrl ?? null,
      },
      members: project.members.map((m) => ({
        userId: m.userId,
        username: m.user.profile?.username ?? '',
        displayName: m.user.profile?.displayName ?? '',
        role: m.role,
      })),
      technologies: project.technologies.map((pt) => ({
        id: pt.technology.id,
        name: pt.technology.name,
        slug: pt.technology.slug,
      })),
      links: project.links.map((l) => ({ id: l.id, label: l.label, url: l.url })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  }
}
