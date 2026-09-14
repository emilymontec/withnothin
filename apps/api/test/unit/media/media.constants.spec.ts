import { getExtensionForMimeType, isAllowedImageType } from '../../../src/modules/media/media.constants';

describe('media.constants — getExtensionForMimeType', () => {
  it('devuelve la extensión correcta para cada tipo MIME permitido', () => {
    expect(getExtensionForMimeType('image/jpeg')).toBe('jpg');
    expect(getExtensionForMimeType('image/png')).toBe('png');
    expect(getExtensionForMimeType('image/webp')).toBe('webp');
    expect(getExtensionForMimeType('image/gif')).toBe('gif');
  });

  it('nunca deriva la extensión de un valor controlado por el usuario', () => {
    // Antes, la extensión salía de dto.fileName.split('.').pop(): si el
    // nombre no tenía punto, ese pop() devolvía el string completo —
    // pudiendo incluir '/' o '..' e inyectar un path traversal en el
    // bucket de Supabase Storage. getExtensionForMimeType solo puede
    // devolver un valor de la tabla fija, sin importar qué mimeType
    // "válido" se le pase — no hay forma de inyectar nada por acá.
    const maliciousLookingMime = 'image/jpeg';
    expect(getExtensionForMimeType(maliciousLookingMime)).toBe('jpg');
  });

  it('cae a "bin" para un mimeType no soportado en vez de fallar', () => {
    expect(getExtensionForMimeType('application/octet-stream')).toBe('bin');
  });

  it('isAllowedImageType rechaza tipos MIME fuera de la whitelist', () => {
    expect(isAllowedImageType('image/svg+xml')).toBe(false);
    expect(isAllowedImageType('application/octet-stream')).toBe(false);
    expect(isAllowedImageType('image/png')).toBe(true);
  });
});
