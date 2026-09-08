import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followsService } from '../services/follows-service';

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['follows', 'followers', userId],
    queryFn: () => followsService.getFollowers(userId),
    enabled: Boolean(userId),
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ['follows', 'following', userId],
    queryFn: () => followsService.getFollowing(userId),
    enabled: Boolean(userId),
  });
}

export function useToggleFollow(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyFollowing: boolean) =>
      isCurrentlyFollowing ? followsService.unfollow(userId) : followsService.follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows', 'followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    },
  });
}
