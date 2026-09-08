import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SignedUploadUrl {
  path: string;
  token: string;
  signedUrl: string;
}

/**
 * Única clase de la API que importa el SDK de Supabase para Storage.
 * Usa la Service Role Key (nunca expuesta al cliente) porque necesita
 * permisos para generar signed upload URLs en nombre del usuario.
 */
@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient(
      this.configService.get<string>('SUPABASE_URL') as string,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') as string,
    );
    this.bucket = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') ?? 'media';
  }

  async createSignedUploadUrl(path: string): Promise<SignedUploadUrl> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUploadUrl(path);

    if (error) {
      throw error;
    }

    return { path: data.path, token: data.token, signedUrl: data.signedUrl };
  }

  getPublicUrl(path: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
