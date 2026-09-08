import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags as ApiTagsDecorator } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { SearchTagsDto } from './dto/search-tags.dto';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@ApiTagsDecorator('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(@Query() query: SearchTagsDto) {
    return this.tagsService.findAll(query.search);
  }
}
