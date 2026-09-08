import { apiClient } from '@/lib/api-client';
import type { Technology } from '../types';

export const technologiesService = {
  search: (query?: string) =>
    apiClient.get<Technology[]>(`/technologies${query ? `?search=${encodeURIComponent(query)}` : ''}`),
};
