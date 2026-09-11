import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [UsersModule, ReportsModule, PostsModule, CommentsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
