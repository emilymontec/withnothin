import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MediaRepository } from './media.repository';
import { SupabaseStorageService } from '../../shared/storage/supabase-storage.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { UploadUrlResponseDto } from './dto/upload-url-response.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { isAllowedImageType, isWithinSizeLimit } from './media.constants';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storageService: SupabaseStorageService,
  ) {}

  /**
   * Paso 1 del flujo de subida (ver docs/architecture, sección 10):
   * valida la solicitud, emite un signed URL y deja un registro PENDING.
   * El archivo real NO pasa por la API — el cliente lo sube directo
   * a Supabase Storage con este signed URL.
   */
  async requestUploadUrl(
    userId: string,
    dto: RequestUploadUrlDto,
  ): Promise<UploadUrlResponseDto> {
    if (!isAllowedImageType(dto.mimeType)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }
    if (!isWithinSizeLimit(dto.sizeBytes)) {
      throw new BadRequestException('El archivo excede el tamaño máximo permitido');
    }

    const extension = dto.fileName.split('.').pop() ?? 'bin';
    const path = `${userId}/${randomUUID()}.${extension}`;

    const signed = await this.storageService.createSignedUploadUrl(path);

    const mediaAsset = await this.mediaRepository.create({
      ownerId: userId,
      bucketPath: signed.path,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
    });

    return new UploadUrlResponseDto({
      mediaId: mediaAsset.id,
      uploadUrl: signed.signedUrl,
      path: signed.path,
      token: signed.token,
    });
  }

  /**
   * Paso 2: el cliente confirma que la subida terminó. Recién acá
   * la media queda lista para asociarse a un post.
   */
  async confirmUpload(userId: string, mediaId: string): Promise<MediaResponseDto> {
    const asset = await this.mediaRepository.findById(mediaId);
    if (!asset) {
      throw new NotFoundException('Media no encontrada');
    }
    if (asset.ownerId !== userId) {
      throw new ForbiddenException('No puedes confirmar una subida de otro usuario');
    }

    const confirmed = await this.mediaRepository.markConfirmed(mediaId);

    return new MediaResponseDto({
      id: confirmed.id,
      url: this.storageService.getPublicUrl(confirmed.bucketPath),
      mimeType: confirmed.mimeType,
      status: confirmed.status,
    });
  }

  /**
   * Usado por PostsService al adjuntar imágenes a un post: verifica
   * que cada mediaId exista, pertenezca al usuario y ya esté confirmado
   * (nadie puede colar un archivo que nunca terminó de subirse).
   */
  async getConfirmedOwnedAssets(userId: string, mediaIds: string[]) {
    if (mediaIds.length === 0) {
      return [];
    }

    const assets = await this.mediaRepository.findManyByIds(mediaIds);

    if (assets.length !== mediaIds.length) {
      throw new BadRequestException('Alguna de las imágenes no existe');
    }
    const invalid = assets.find((a) => a.ownerId !== userId || a.status !== 'CONFIRMED');
    if (invalid) {
      throw new ForbiddenException('Alguna de las imágenes no te pertenece o no fue confirmada');
    }

    return assets;
  }
}
