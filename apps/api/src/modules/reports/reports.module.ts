import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
  exports: [ReportsRepository], // AdminModule lo usa para listar/revisar reportes
})
export class ReportsModule {}
