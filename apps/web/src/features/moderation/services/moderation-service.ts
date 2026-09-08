import { apiClient } from '@/lib/api-client';

export interface BlockedOrMutedUser {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export type ReportTargetType = 'POST' | 'COMMENT' | 'USER';

export const moderationService = {
  block: (userId: string) => apiClient.post<void>(`/users/${userId}/block`, {}),
  unblock: (userId: string) => apiClient.delete<void>(`/users/${userId}/block`),
  getBlocked: () => apiClient.get<BlockedOrMutedUser[]>('/blocks'),

  mute: (userId: string) => apiClient.post<void>(`/users/${userId}/mute`, {}),
  unmute: (userId: string) => apiClient.delete<void>(`/users/${userId}/mute`),
  getMuted: () => apiClient.get<BlockedOrMutedUser[]>('/mutes'),

  report: (targetType: ReportTargetType, targetId: string, reason: string) =>
    apiClient.post<{ id: string; status: string }>('/reports', { targetType, targetId, reason }),
};
