import { PostType, PostVisibility } from '@withnothin/shared-types';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  // Nombres libres de tecnologías — el service resuelve find-or-create.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];

  // IDs de MediaAsset ya confirmados (ver módulo media).
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  mediaIds?: string[];

  // Publicar dentro de una comunidad (opcional) — el service valida
  // que el usuario sea miembro antes de aceptar el post.
  @IsOptional()
  @IsString()
  communityId?: string;

  // Campos específicos por tipo (ej. STUCK podría guardar `errorMessage`).
  // Deliberadamente sin schema fijo aún — ver decisiones pendientes de la arquitectura.
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
