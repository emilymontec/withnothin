import { apiClient } from '@/lib/api-client';
import type { Answer } from '@withnothin/shared-types';

export const answersService = {
  findByPost: (postId: string) => apiClient.get<Answer[]>(`/posts/${postId}/answers`),
  create: (postId: string, content: string) =>
    apiClient.post<Answer>(`/posts/${postId}/answers`, { content }),
  accept: (postId: string, answerId: string) =>
    apiClient.patch<Answer>(`/posts/${postId}/answers/${answerId}/accept`, {}),
  vote: (answerId: string, value: 1 | -1) =>
    apiClient.post<void>(`/answers/${answerId}/votes`, { value }),
  unvote: (answerId: string) => apiClient.delete<void>(`/answers/${answerId}/votes`),
};
