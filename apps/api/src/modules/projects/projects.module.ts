import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { ProjectsPolicy } from './policies/projects.policy';
import { TechnologiesModule } from '../technologies/technologies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TechnologiesModule, UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, ProjectsPolicy],
})
export class ProjectsModule {}
