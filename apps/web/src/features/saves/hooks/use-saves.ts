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
    onMutate: async (isCurrentlySaved) => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });
      const previous = queryClient.getQueryData(['posts', postId]);

      queryClient.setQueryData(['posts', postId], (old: any) =>
        old ? { ...old, isSavedByCurrentUser: !isCurrentlySaved } : old,
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts', postId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['saves', 'mine'] });
    },
  });
}
