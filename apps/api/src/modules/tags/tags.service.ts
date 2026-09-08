import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { slugify } from '../../common/utils/slugify';
import { Tag } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  findAll(search?: string): Promise<Tag[]> {
    return this.tagsRepository.findAll(search);
  }

  async findOrCreateByName(name: string): Promise<Tag> {
    const slug = slugify(name);
    const existing = await this.tagsRepository.findBySlug(slug);
    if (existing) {
      return existing;
    }
    return this.tagsRepository.create({ name: name.trim(), slug });
  }
}
