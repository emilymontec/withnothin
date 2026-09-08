import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';
import { PostsModule } from '../posts/posts.module';
import { TechnologiesModule } from '../technologies/technologies.module';

@Module({
  imports: [PostsModule, TechnologiesModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
})
export class SearchModule {}
