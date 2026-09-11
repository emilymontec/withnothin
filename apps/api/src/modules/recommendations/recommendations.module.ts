import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsRepository } from './recommendations.repository';
import { FollowsModule } from '../follows/follows.module';
import { BlocksModule } from '../blocks/blocks.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [FollowsModule, BlocksModule, ProfilesModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, RecommendationsRepository],
})
export class RecommendationsModule {}
