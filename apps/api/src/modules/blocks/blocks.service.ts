import { BadRequestException, Injectable } from '@nestjs/common';
import { BlocksRepository } from './blocks.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { FollowUserResponseDto } from '../follows/dto/follow-user-response.dto';

@Injectable()
export class BlocksService {
  constructor(
    private readonly blocksRepository: BlocksRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async block(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) {
      throw new BadRequestException('No puedes bloquearte a ti mismo');
    }

    await this.blocksRepository.block(blockerId, blockedId);
    // Nota de alcance (v1): bloquear NO borra automáticamente follows
    // existentes entre ambos usuarios — evita una dependencia circular
    // entre BlocksModule y FollowsModule. El filtrado en feed/listados
    // ya oculta el contenido mutuamente, y FollowsModule impide crear
    // NUEVOS follows entre usuarios bloqueados (ver FollowsService).
    // Si esto resulta insuficiente en la práctica, se resuelve con un
    // evento de dominio en vez de una llamada directa entre módulos.
  }

  async unblock(blockerId: string, blockedId: string): Promise<void> {
    await this.blocksRepository.unblock(blockerId, blockedId);
  }

  /** Usado por FollowsService para impedir seguir a alguien bloqueado (en cualquier dirección). */
  isBlockedEitherDirection(userA: string, userB: string): Promise<boolean> {
    return this.blocksRepository.existsEitherDirection(userA, userB);
  }

  /** Usado por FeedService: oculta contenido en ambas direcciones del bloqueo. */
  async getBlockedEitherDirectionIds(userId: string): Promise<string[]> {
    const [blocked, blockedBy] = await Promise.all([
      this.blocksRepository.findBlockedIds(userId),
      this.blocksRepository.findBlockedByIds(userId),
    ]);
    return [...new Set([...blocked, ...blockedBy])];
  }

  async getBlockedUsers(userId: string): Promise<FollowUserResponseDto[]> {
    const blockedIds = await this.blocksRepository.findBlockedIds(userId);
    const summaries = await this.profilesService.findSummariesByUserIds(blockedIds);
    return summaries.map((s) => new FollowUserResponseDto(s));
  }
}
