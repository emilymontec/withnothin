import { apiClient } from '@/lib/api-client';

export interface FollowUser {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export const followsService = {
  follow: (userId: string) => apiClient.post<void>(`/users/${userId}/follow`, {}),
  unfollow: (userId: string) => apiClient.delete<void>(`/users/${userId}/follow`),
  getFollowers: (userId: string) => apiClient.get<FollowUser[]>(`/users/${userId}/followers`),
  getFollowing: (userId: string) => apiClient.get<FollowUser[]>(`/users/${userId}/following`),
};
