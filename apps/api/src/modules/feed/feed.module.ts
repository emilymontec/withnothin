import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostsModule } from '../posts/posts.module';
import { FollowsModule } from '../follows/follows.module';
import { BlocksModule } from '../blocks/blocks.module';
import { MutesModule } from '../mutes/mutes.module';

@Module({
  imports: [PostsModule, FollowsModule, BlocksModule, MutesModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
