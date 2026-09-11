import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin-service';

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: () => adminService.getUsers() });
}

export function useAdminReports(status?: string) {
  return useQuery({
    queryKey: ['admin', 'reports', status],
    queryFn: () => adminService.getReports(status),
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      isActive ? adminService.deactivateUser(userId) : adminService.reactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: 'REVIEWED' | 'DISMISSED' }) =>
      adminService.updateReportStatus(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
