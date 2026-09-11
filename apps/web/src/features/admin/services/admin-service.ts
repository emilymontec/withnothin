import { apiClient } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  username: string | null;
  displayName: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AdminReport {
  id: string;
  reporterId: string;
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
  createdAt: string;
}

export const adminService = {
  getUsers: (cursor?: string) =>
    apiClient.get<AdminUser[]>(`/admin/users${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),
  deactivateUser: (userId: string) => apiClient.patch<void>(`/admin/users/${userId}/deactivate`, {}),
  reactivateUser: (userId: string) => apiClient.patch<void>(`/admin/users/${userId}/reactivate`, {}),

  getReports: (status?: string) =>
    apiClient.get<AdminReport[]>(`/admin/reports${status ? `?status=${status}` : ''}`),
  updateReportStatus: (reportId: string, status: 'REVIEWED' | 'DISMISSED') =>
    apiClient.patch<AdminReport>(`/admin/reports/${reportId}`, { status }),

  removePost: (postId: string) => apiClient.delete<void>(`/admin/posts/${postId}`),
  removeComment: (commentId: string) => apiClient.delete<void>(`/admin/comments/${commentId}`),
};
