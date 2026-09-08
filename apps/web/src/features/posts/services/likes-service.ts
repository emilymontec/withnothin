import { apiClient } from '@/lib/api-client';

export const likesService = {
  like: (postId: string) => apiClient.post<void>(`/posts/${postId}/likes`, {}),
  unlike: (postId: string) => apiClient.delete<void>(`/posts/${postId}/likes`),
};
