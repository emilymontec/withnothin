import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { FollowsRepository } from './follows.repository';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BlocksService } from '../blocks/blocks.service';
import { NotificationType } from '@withnothin/shared-types';
import { FollowUserResponseDto } from './dto/follow-user-response.dto';

@Injectable()
export class FollowsService {
  constructor(
    private readonly followsRepository: FollowsRepository,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly notificationsService: NotificationsService,
    private readonly blocksService: BlocksService,
  ) {}

  async follow(followerId: string, followeeId: string): Promise<void> {
    if (followerId === followeeId) {
      throw new BadRequestException('No puedes seguirte a ti mismo');
    }
    // Lanza NotFoundException si el usuario a seguir no existe.
    await this.usersService.findById(followeeId);

    const isBlocked = await this.blocksService.isBlockedEitherDirection(followerId, followeeId);
    if (isBlocked) {
      // Mensaje genérico a propósito: no revela si bloqueaste tú o te bloquearon.
      throw new ForbiddenException('No puedes seguir a este usuario');
    }

    await this.followsRepository.follow(followerId, followeeId);

    await this.notificationsService.notify({
      userId: followeeId,
      type: NotificationType.FOLLOW,
      payload: { actorId: followerId },
    });
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    await this.followsRepository.unfollow(followerId, followeeId);
  }

  async getFollowers(userId: string): Promise<FollowUserResponseDto[]> {
    const followerIds = await this.followsRepository.findFollowerIds(userId);
    const summaries = await this.profilesService.findSummariesByUserIds(followerIds);
    return summaries.map((s) => new FollowUserResponseDto(s));
  }

  async getFollowing(userId: string): Promise<FollowUserResponseDto[]> {
    const followeeIds = await this.followsRepository.findFolloweeIds(userId);
    const summaries = await this.profilesService.findSummariesByUserIds(followeeIds);
    return summaries.map((s) => new FollowUserResponseDto(s));
  }

  /** Insumo directo del FeedService — no pasa por DTO de respuesta. */
  getFolloweeIds(userId: string): Promise<string[]> {
    return this.followsRepository.findFolloweeIds(userId);
  }
}
