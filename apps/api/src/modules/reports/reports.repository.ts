import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Report } from '@prisma/client';

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    reporterId: string;
    targetType: string;
    targetId: string;
    reason: string;
  }): Promise<Report> {
    return this.prisma.report.create({ data });
  }

  /** Usado solo por el módulo admin. */
  findAllForAdmin(status: string | undefined, cursor: string | undefined, limit: number): Promise<Report[]> {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

  findRawById(id: string): Promise<Report | null> {
    return this.prisma.report.findUnique({ where: { id } });
  }

  updateStatus(id: string, status: string): Promise<Report> {
    return this.prisma.report.update({ where: { id }, data: { status } });
  }
}
