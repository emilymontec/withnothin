import { apiClient } from '@/lib/api-client';

export interface Comment {
  id: string;
  content: string;
  parentCommentId: string | null;
  isDeleted: boolean;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  createdAt: string;
}

export interface CreateCommentInput {
  content: string;
  parentCommentId?: string;
}

export const commentsService = {
  findByPost: (postId: string) => apiClient.get<Comment[]>(`/posts/${postId}/comments`),

  create: (postId: string, input: CreateCommentInput) =>
    apiClient.post<Comment>(`/posts/${postId}/comments`, input),

  remove: (commentId: string) => apiClient.delete<void>(`/comments/${commentId}`),
};
