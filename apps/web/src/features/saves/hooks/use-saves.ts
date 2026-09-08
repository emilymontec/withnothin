import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savesService } from '../services/saves-service';

export function useMySaves() {
  return useQuery({
    queryKey: ['saves', 'mine'],
    queryFn: () => savesService.findMine(),
  });
}

/** Mismo patrón optimista que useToggleLike (ver features/posts). */
export function useToggleSave(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlySaved: boolean) =>
      isCurrentlySaved ? savesService.unsave(postId) : savesService.save(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saves', 'mine'] });
    },
  });
}
