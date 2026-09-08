import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class MutesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async mute(muterId: string, mutedId: string): Promise<void> {
    await this.prisma.mute.upsert({
      where: { muterId_mutedId: { muterId, mutedId } },
      update: {},
      create: { muterId, mutedId },
    });
  }

  async unmute(muterId: string, mutedId: string): Promise<void> {
    await this.prisma.mute.deleteMany({ where: { muterId, mutedId } });
  }

  findMutedIds(userId: string): Promise<string[]> {
    return this.prisma.mute
      .findMany({ where: { muterId: userId }, select: { mutedId: true } })
      .then((rows) => rows.map((r) => r.mutedId));
  }
}
