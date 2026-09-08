import { apiClient } from '@/lib/api-client';

export interface AppNotification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW';
  payload: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationsService = {
  findMine: (cursor?: string) =>
    apiClient.get<AppNotification[]>(
      `/notifications${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
    ),
  getUnreadCount: () => apiClient.get<number>('/notifications/unread-count'),
  markRead: (id: string) => apiClient.patch<void>(`/notifications/${id}/read`, {}),
  markAllRead: () => apiClient.patch<void>('/notifications/read-all', {}),
};
