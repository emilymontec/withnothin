import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { BlocksRepository } from './blocks.repository';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  controllers: [BlocksController],
  providers: [BlocksService, BlocksRepository],
  exports: [BlocksService], // FollowsModule y FeedModule lo consultan (dependencia unidireccional)
})
export class BlocksModule {}
