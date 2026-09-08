import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  findByUsername(username: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { username } });
  }

  findManyByUserIds(userIds: string[]): Promise<Profile[]> {
    return this.prisma.profile.findMany({ where: { userId: { in: userIds } } });
  }

  create(data: {
    userId: string;
    username: string;
    displayName: string;
  }): Promise<Profile> {
    return this.prisma.profile.create({ data });
  }

  update(userId: string, data: Partial<Omit<Profile, 'id' | 'userId'>>): Promise<Profile> {
    return this.prisma.profile.update({ where: { userId }, data });
  }
}
