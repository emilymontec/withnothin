export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function isAllowedImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);
}

/**
 * La extensión del path en storage se deriva SIEMPRE del mimeType ya
 * validado, nunca del fileName provisto por el cliente. fileName es
 * texto libre del usuario: usarlo para construir un path (aunque sea
 * solo la "extensión") permite inyectar '/', '..' u otros caracteres
 * si el nombre no contiene un punto, abriendo un path traversal hacia
 * el bucket de Supabase Storage.
 */
export function getExtensionForMimeType(mimeType: string): string {
  return EXTENSION_BY_MIME_TYPE[mimeType] ?? 'bin';
}

export function isWithinSizeLimit(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= MAX_IMAGE_SIZE_BYTES;
}
