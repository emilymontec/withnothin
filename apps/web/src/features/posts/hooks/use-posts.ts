import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/posts-service';
import { likesService } from '../services/likes-service';
import type { CreatePostInput } from '../types';

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsService.getById(id),
    enabled: Boolean(id),
  });
}

export function usePosts(params: { type?: string; technology?: string; authorId?: string } = {}) {
  return useQuery({
    queryKey: ['posts', 'list', params],
    queryFn: () => postsService.findMany(params),
  });
}

export function useFeed() {
  return useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => postsService.getFeed(),
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: (input: CreatePostInput) => postsService.create(input),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postsService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
      queryClient.removeQueries({ queryKey: ['posts', id] });
    },
  });
}

/**
 * Toggle optimista: la UI cambia de inmediato y se revierte solo si
 * la request falla. Un like es una acción de baja fricción — esperar
 * la respuesta del servidor antes de reflejarlo se siente lento.
 */
export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? likesService.unlike(postId) : likesService.like(postId),
    onMutate: async (isCurrentlyLiked) => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });
      const previous = queryClient.getQueryData(['posts', postId]);

      queryClient.setQueryData(['posts', postId], (old: any) =>
        old
          ? { ...old, likesCount: old.likesCount + (isCurrentlyLiked ? -1 : 1) }
          : old,
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
    },
  });
}
