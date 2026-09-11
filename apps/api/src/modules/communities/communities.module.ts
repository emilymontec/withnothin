import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { CommunitiesRepository } from './communities.repository';
import { CommunitiesPolicy } from './policies/communities.policy';

@Module({
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesRepository, CommunitiesPolicy],
  exports: [CommunitiesService], // PostsModule lo usa para validar membresía al postear en una comunidad
})
export class CommunitiesModule {}
