import { Module } from '@nestjs/common';
import { MutesController } from './mutes.controller';
import { MutesService } from './mutes.service';
import { MutesRepository } from './mutes.repository';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  controllers: [MutesController],
  providers: [MutesService, MutesRepository],
  exports: [MutesService], // FeedModule lo consulta
})
export class MutesModule {}
