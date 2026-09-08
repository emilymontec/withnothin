import { apiClient } from '@/lib/api-client';
import type { CreateProfileInput, Profile } from '../types';

/**
 * Único punto de comunicación con /profiles desde la web.
 * Componentes y hooks nunca llaman a apiClient directamente para esto.
 */
export const profilesService = {
  getMine: () => apiClient.get<Profile>('/profiles/me'),

  getByUsername: (username: string) => apiClient.get<Profile>(`/profiles/${username}`),

  create: (input: CreateProfileInput) => apiClient.post<Profile>('/profiles/me', input),

  update: (input: Partial<CreateProfileInput>) =>
    apiClient.patch<Profile>('/profiles/me', input),
};
