import { apiClient } from '@/lib/api-client';

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export const usersService = {
  getMe: () => apiClient.get<CurrentUser>('/users/me'),
};
