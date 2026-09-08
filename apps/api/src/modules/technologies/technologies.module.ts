import { Module } from '@nestjs/common';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';
import { TechnologiesRepository } from './technologies.repository';

@Module({
  controllers: [TechnologiesController],
  providers: [TechnologiesService, TechnologiesRepository],
  exports: [TechnologiesService], // Posts (Fase 4) dependerá de findOrCreateByName
})
export class TechnologiesModule {}
