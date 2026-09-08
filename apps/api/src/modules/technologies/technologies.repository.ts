import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Technology } from '@prisma/client';

@Injectable()
export class TechnologiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string): Promise<Technology[]> {
    return this.prisma.technology.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      orderBy: { name: 'asc' },
      take: 50,
    });
  }

  findBySlug(slug: string): Promise<Technology | null> {
    return this.prisma.technology.findUnique({ where: { slug } });
  }

  create(data: { name: string; slug: string }): Promise<Technology> {
    return this.prisma.technology.create({ data });
  }
}
