import { BadRequestException, Injectable } from '@nestjs/common';
import { MutesRepository } from './mutes.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { FollowUserResponseDto } from '../follows/dto/follow-user-response.dto';

@Injectable()
export class MutesService {
  constructor(
    private readonly mutesRepository: MutesRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async mute(muterId: string, mutedId: string): Promise<void> {
    if (muterId === mutedId) {
      throw new BadRequestException('No puedes silenciarte a ti mismo');
    }
    await this.mutesRepository.mute(muterId, mutedId);
  }

  async unmute(muterId: string, mutedId: string): Promise<void> {
    await this.mutesRepository.unmute(muterId, mutedId);
  }

  /** Usado por FeedService: oculta posts del silenciado SOLO en el feed de quien silencia. */
  getMutedIds(userId: string): Promise<string[]> {
    return this.mutesRepository.findMutedIds(userId);
  }

  async getMutedUsers(userId: string): Promise<FollowUserResponseDto[]> {
    const mutedIds = await this.mutesRepository.findMutedIds(userId);
    const summaries = await this.profilesService.findSummariesByUserIds(mutedIds);
    return summaries.map((s) => new FollowUserResponseDto(s));
  }
}
