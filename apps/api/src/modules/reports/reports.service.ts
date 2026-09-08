import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';

/**
 * Moderación mínima (v1): reportar deja un registro PENDING, sin
 * flujo de revisión todavía. Deliberadamente NO se valida que el
 * `targetId` exista — reportar un id inexistente es inofensivo y se
 * descarta al revisar (ver Fase 12, Admin Dashboard). Agregar esa
 * validación es sencillo si en la práctica genera ruido.
 */
@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async create(reporterId: string, dto: CreateReportDto): Promise<ReportResponseDto> {
    const report = await this.reportsRepository.create({
      reporterId,
      targetType: dto.targetType,
      targetId: dto.targetId,
      reason: dto.reason,
    });

    return new ReportResponseDto({
      id: report.id,
      status: report.status,
      createdAt: report.createdAt,
    });
  }
}
