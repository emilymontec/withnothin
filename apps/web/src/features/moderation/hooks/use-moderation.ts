import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { moderationService } from '../services/moderation-service';
import type { ReportTargetType } from '../services/moderation-service';

export function useBlockedUsers() {
  return useQuery({ queryKey: ['moderation', 'blocked'], queryFn: moderationService.getBlocked });
}

export function useMutedUsers() {
  return useQuery({ queryKey: ['moderation', 'muted'], queryFn: moderationService.getMuted });
}

export function useToggleBlock(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isCurrentlyBlocked: boolean) =>
      isCurrentlyBlocked ? moderationService.unblock(userId) : moderationService.block(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation', 'blocked'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });
}

export function useToggleMute(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isCurrentlyMuted: boolean) =>
      isCurrentlyMuted ? moderationService.unmute(userId) : moderationService.mute(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation', 'muted'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    },
  });
}

export function useReport() {
  return useMutation({
    mutationFn: ({ targetType, targetId, reason }: { targetType: ReportTargetType; targetId: string; reason: string }) =>
      moderationService.report(targetType, targetId, reason),
  });
}
