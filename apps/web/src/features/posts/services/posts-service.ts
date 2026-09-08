import { apiClient } from '@/lib/api-client';
import type { Post } from '@withnothin/shared-types';
import type { CreatePostInput } from '../types';

interface FindPostsParams {
  cursor?: string;
  type?: string;
  technology?: string;
  authorId?: string;
}

function buildQuery(params: FindPostsParams): string {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.type) searchParams.set('type', params.type);
  if (params.technology) searchParams.set('technology', params.technology);
  if (params.authorId) searchParams.set('authorId', params.authorId);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const postsService = {
  create: (input: CreatePostInput) => apiClient.post<Post>('/posts', input),

  getById: (id: string) => apiClient.get<Post>(`/posts/${id}`),

  findMany: (params: FindPostsParams = {}) => apiClient.get<Post[]>(`/posts${buildQuery(params)}`),

  // El feed personalizado (posts propios + de usuarios seguidos) vive
  // en un endpoint separado porque depende de la sesión, a diferencia
  // de /posts que es un listado público.
  getFeed: (cursor?: string) =>
    apiClient.get<Post[]>(`/feed${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),

  update: (id: string, input: Partial<CreatePostInput>) =>
    apiClient.patch<Post>(`/posts/${id}`, input),

  remove: (id: string) => apiClient.delete<void>(`/posts/${id}`),
};
