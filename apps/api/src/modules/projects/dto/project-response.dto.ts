import { Exclude, Expose, Type } from 'class-transformer';

class ProjectOwnerDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string | null;
}

class ProjectMemberDto {
  @Expose()
  userId: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  role: string;
}

class ProjectTechnologyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}

class ProjectLinkDto {
  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  url: string;
}

@Exclude()
export class ProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  status: string;

  @Expose()
  @Type(() => ProjectOwnerDto)
  owner: ProjectOwnerDto;

  @Expose()
  @Type(() => ProjectMemberDto)
  members: ProjectMemberDto[];

  @Expose()
  @Type(() => ProjectTechnologyDto)
  technologies: ProjectTechnologyDto[];

  @Expose()
  @Type(() => ProjectLinkDto)
  links: ProjectLinkDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ProjectResponseDto>) {
    Object.assign(this, partial);
  }
}
