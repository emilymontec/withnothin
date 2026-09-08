import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsPolicy } from './policies/posts.policy';
import { TechnologiesModule } from '../technologies/technologies.module';
import { TagsModule } from '../tags/tags.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TechnologiesModule, TagsModule, MediaModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostsPolicy],
  exports: [PostsRepository, PostsService], // Comments/Likes usan el repository; Feed reutiliza el mapper del service
})
export class PostsModule {}
