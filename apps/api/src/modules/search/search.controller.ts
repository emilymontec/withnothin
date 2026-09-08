import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { Public } from '../../common/decorators/public.decorator';

// Búsqueda pública — se puede explorar WithNothin sin cuenta, igual
// que el listado de posts (ver módulo posts).
@Public()
@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Throttle({ default: { limit: 30, ttl: 60_000 } }) // más laxo que creación de contenido, pero sigue limitado
  @Get()
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query.q, query.type);
  }
}
