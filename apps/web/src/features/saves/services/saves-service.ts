import { apiClient } from '@/lib/api-client';
import type { Post } from '@withnothin/shared-types';

export const savesService = {
  save: (postId: string) => apiClient.post<void>(`/posts/${postId}/saves`, {}),
  unsave: (postId: string) => apiClient.delete<void>(`/posts/${postId}/saves`),
  findMine: (cursor?: string) =>
    apiClient.get<Post[]>(`/saves${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),
};
