import { Injectable } from '@nestjs/common';
import { TechnologiesRepository } from './technologies.repository';
import { slugify } from '../../common/utils/slugify';
import { Technology } from '@prisma/client';

@Injectable()
export class TechnologiesService {
  constructor(private readonly technologiesRepository: TechnologiesRepository) {}

  findAll(search?: string): Promise<Technology[]> {
    return this.technologiesRepository.findAll(search);
  }

  /**
   * Usado por otros módulos (ej. Posts en Fase 4) cuando el usuario
   * etiquetó una tecnología por nombre libre. Si ya existe (por slug),
   * la reutiliza; si no, la crea. Evita que el catálogo requiera
   * moderación manual para crecer.
   */
  async findOrCreateByName(name: string): Promise<Technology> {
    const slug = slugify(name);
    const existing = await this.technologiesRepository.findBySlug(slug);
    if (existing) {
      return existing;
    }
    return this.technologiesRepository.create({ name: name.trim(), slug });
  }
}
