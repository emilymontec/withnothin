import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '../services/comments-service';
import type { CreateCommentInput } from '../services/comments-service';

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsService.findByPost(postId),
    enabled: Boolean(postId),
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) => commentsService.create(postId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] }); // refleja el nuevo commentsCount
    },
  });
}
