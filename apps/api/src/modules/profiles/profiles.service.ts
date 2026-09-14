import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async createForUser(userId: string, dto: CreateProfileDto): Promise<ProfileResponseDto> {
    const existing = await this.profilesRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictException('El usuario ya tiene un perfil creado');
    }

    const usernameTaken = await this.profilesRepository.findByUsername(dto.username);
    if (usernameTaken) {
      throw new ConflictException('Ese username ya está en uso');
    }

    const profile = await this.profilesRepository.create({
      userId,
      username: dto.username,
      displayName: dto.displayName,
    });

    if (dto.bio || dto.headline || dto.location) {
      return this.updateForUser(userId, {
        bio: dto.bio,
        headline: dto.headline,
        location: dto.location,
      });
    }

    return new ProfileResponseDto({
      ...profile,
      followersCount: 0,
      followingCount: 0,
      isFollowedByCurrentUser: false,
    });
  }

  async updateForUser(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const existing = await this.profilesRepository.findByUserId(userId);
    if (!existing) {
      throw new NotFoundException('El usuario todavía no tiene un perfil creado');
    }

    const updated = await this.profilesRepository.update(userId, dto);
    const stats = await this.profilesRepository.getFollowStats(userId, userId);
    return new ProfileResponseDto({ ...updated, ...stats });
  }

  async findByUsername(username: string, currentUserId?: string): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findByUsername(username);
    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }
    const stats = await this.profilesRepository.getFollowStats(profile.userId, currentUserId);
    return new ProfileResponseDto({ ...profile, ...stats });
  }

  async findByUserId(userId: string): Promise<ProfileResponseDto | null> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) return null;
    const stats = await this.profilesRepository.getFollowStats(userId, userId);
    return new ProfileResponseDto({ ...profile, ...stats });
  }

  /**
   * Usado por FollowsService para listar seguidores/seguidos sin
   * necesitar el objeto Profile completo — solo lo que se muestra
   * en una lista (avatar, nombre, username).
   */
  async findSummariesByUserIds(
    userIds: string[],
  ): Promise<Array<{ userId: string; username: string; displayName: string; avatarUrl: string | null }>> {
    if (userIds.length === 0) return [];
    const profiles = await this.profilesRepository.findManyByUserIds(userIds);
    return profiles.map((p) => ({
      userId: p.userId,
      username: p.username,
      displayName: p.displayName,
      avatarUrl: p.avatarUrl,
    }));
  }
}
