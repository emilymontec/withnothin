import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

const USER_WITH_PROFILE_INCLUDE = { profile: true } satisfies Prisma.UserInclude;
export type UserWithProfile = Prisma.UserGetPayload<{ include: typeof USER_WITH_PROFILE_INCLUDE }>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  create(data: { id: string; email: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  reactivate(id: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { deletedAt: null } });
  }

  /** Usado solo por el módulo admin — incluye usuarios desactivados. */
  findAllForAdmin(cursor: string | undefined, limit: number): Promise<UserWithProfile[]> {
    return this.prisma.user.findMany({
      include: USER_WITH_PROFILE_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }
}
