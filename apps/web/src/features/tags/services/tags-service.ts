import { apiClient } from '@/lib/api-client';

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export const tagsService = {
  search: (query?: string) =>
    apiClient.get<Tag[]>(`/tags${query ? `?search=${encodeURIComponent(query)}` : ''}`),
};
