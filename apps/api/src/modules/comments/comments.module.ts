import { Module } from '@nestjs/common';
import { PostCommentsController, CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { PostsModule } from '../posts/posts.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PostsModule, NotificationsModule],
  controllers: [PostCommentsController, CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository], // AdminModule lo usa para borrado forzado
})
export class CommentsModule {}
