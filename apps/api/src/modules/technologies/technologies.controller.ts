import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { SearchTechnologiesDto } from './dto/search-technologies.dto';
import { Public } from '../../common/decorators/public.decorator';

// El catálogo de tecnologías es público: se necesita para armar
// selectores de creación de post/perfil incluso antes de loguearse.
@Public()
@ApiTags('technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  findAll(@Query() query: SearchTechnologiesDto) {
    return this.technologiesService.findAll(query.search);
  }
}
