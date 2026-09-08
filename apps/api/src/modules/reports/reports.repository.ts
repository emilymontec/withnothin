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
}
