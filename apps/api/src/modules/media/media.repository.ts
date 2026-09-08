import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MediaAsset } from '@prisma/client';

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    ownerId: string;
    bucketPath: string;
    mimeType: string;
    sizeBytes: number;
  }): Promise<MediaAsset> {
    return this.prisma.mediaAsset.create({ data });
  }

  findById(id: string): Promise<MediaAsset | null> {
    return this.prisma.mediaAsset.findUnique({ where: { id } });
  }

  findManyByIds(ids: string[]): Promise<MediaAsset[]> {
    return this.prisma.mediaAsset.findMany({ where: { id: { in: ids } } });
  }

  markConfirmed(id: string): Promise<MediaAsset> {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });
  }
}
