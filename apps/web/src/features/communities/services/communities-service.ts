import { apiClient } from '@/lib/api-client';
import type { Community, Post } from '@withnothin/shared-types';

export interface CreateCommunityInput {
  name: string;
  slug: string;
  description?: string;
}

export interface CommunityMember {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export const communitiesService = {
  create: (input: CreateCommunityInput) => apiClient.post<Community>('/communities', input),
  findMany: (cursor?: string) =>
    apiClient.get<Community[]>(`/communities${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),
  getBySlug: (slug: string) => apiClient.get<Community>(`/communities/slug/${slug}`),
  update: (id: string, input: Partial<CreateCommunityInput>) =>
    apiClient.patch<Community>(`/communities/${id}`, input),
  remove: (id: string) => apiClient.delete<void>(`/communities/${id}`),
  join: (id: string) => apiClient.post<void>(`/communities/${id}/join`, {}),
  leave: (id: string) => apiClient.delete<void>(`/communities/${id}/join`),
  getMembers: (id: string) => apiClient.get<CommunityMember[]>(`/communities/${id}/members`),
  getPosts: (communityId: string) => apiClient.get<Post[]>(`/posts?communityId=${communityId}`),
};
