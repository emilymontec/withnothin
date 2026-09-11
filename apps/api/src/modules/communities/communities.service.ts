import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CommunitiesRepository, CommunityWithRelations } from './communities.repository';
import { CommunitiesPolicy } from './policies/communities.policy';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityResponseDto } from './dto/community-response.dto';
import { FollowUserResponseDto } from '../follows/dto/follow-user-response.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    private readonly communitiesRepository: CommunitiesRepository,
    private readonly communitiesPolicy: CommunitiesPolicy,
  ) {}

  async create(userId: string, dto: CreateCommunityDto): Promise<CommunityResponseDto> {
    const existing = await this.communitiesRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('Ese slug ya está en uso');
    }

    const community = await this.communitiesRepository.create({
      ownerId: userId,
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
    });

    return this.toResponseDto(community);
  }

  async findById(id: string): Promise<CommunityResponseDto> {
    const community = await this.communitiesRepository.findById(id);
    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }
    return this.toResponseDto(community);
  }

  async findBySlug(slug: string): Promise<CommunityResponseDto> {
    const community = await this.communitiesRepository.findBySlug(slug);
    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }
    return this.toResponseDto(community);
  }

  async findMany(cursor: string | undefined, limit: number): Promise<CommunityResponseDto[]> {
    const communities = await this.communitiesRepository.findMany({ cursor, limit });
    return communities.map((c) => this.toResponseDto(c));
  }

  async update(userId: string, id: string, dto: UpdateCommunityDto): Promise<CommunityResponseDto> {
    const existing = await this.communitiesRepository.findRawById(id);
    if (!existing) {
      throw new NotFoundException('Comunidad no encontrada');
    }
    this.communitiesPolicy.assertCanManage(existing, userId);

    const updated = await this.communitiesRepository.update(id, dto);
    return this.toResponseDto(updated);
  }

  async softDelete(userId: string, id: string): Promise<void> {
    const existing = await this.communitiesRepository.findRawById(id);
    if (!existing) {
      throw new NotFoundException('Comunidad no encontrada');
    }
    this.communitiesPolicy.assertCanManage(existing, userId);

    await this.communitiesRepository.softDelete(id);
  }

  async join(communityId: string, userId: string): Promise<void> {
    const community = await this.communitiesRepository.findRawById(communityId);
    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }
    await this.communitiesRepository.join(communityId, userId);
  }

  async leave(communityId: string, userId: string): Promise<void> {
    await this.communitiesRepository.leave(communityId, userId);
  }

  async getMembers(communityId: string): Promise<FollowUserResponseDto[]> {
    const members = await this.communitiesRepository.findMembers(communityId);
    return members.map(
      (m) =>
        new FollowUserResponseDto({
          userId: m.userId,
          username: m.user.profile?.username ?? '',
          displayName: m.user.profile?.displayName ?? '',
          avatarUrl: m.user.profile?.avatarUrl ?? null,
        }),
    );
  }

  async removeMember(userId: string, communityId: string, memberId: string): Promise<void> {
    const community = await this.communitiesRepository.findRawById(communityId);
    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }
    this.communitiesPolicy.assertCanManage(community, userId);

    await this.communitiesRepository.removeMember(communityId, memberId);
  }

  /** Usado por PostsService al validar que se puede postear en la comunidad. */
  isMember(communityId: string, userId: string): Promise<boolean> {
    return this.communitiesRepository.isMember(communityId, userId);
  }

  private toResponseDto(community: CommunityWithRelations): CommunityResponseDto {
    return new CommunityResponseDto({
      id: community.id,
      slug: community.slug,
      name: community.name,
      description: community.description,
      owner: {
        id: community.owner.id,
        username: community.owner.profile?.username ?? '',
        displayName: community.owner.profile?.displayName ?? '',
      },
      membersCount: community._count.members,
      createdAt: community.createdAt,
    });
  }
}
