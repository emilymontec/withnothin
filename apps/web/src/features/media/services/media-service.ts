import { apiClient } from '@/lib/api-client';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import type { MediaAsset, UploadUrlResponse } from '../types';

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'media';

/**
 * Implementa el flujo de storage definido en la arquitectura (sección 10):
 * 1. Pide a la API un signed upload URL (valida tipo/tamaño ahí).
 * 2. Sube el archivo DIRECTO a Supabase Storage (no pasa por la API).
 * 3. Confirma la subida contra la API para que quede registrada.
 */
export const mediaService = {
  async uploadFile(file: File): Promise<MediaAsset> {
    const { mediaId, path, token } = await apiClient.post<UploadUrlResponse>('/media/upload-url', {
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });

    const { error } = await supabaseBrowserClient.storage
      .from(STORAGE_BUCKET)
      .uploadToSignedUrl(path, token, file);

    if (error) {
      throw error;
    }

    return apiClient.post<MediaAsset>(`/media/${mediaId}/confirm`, {});
  },
};
