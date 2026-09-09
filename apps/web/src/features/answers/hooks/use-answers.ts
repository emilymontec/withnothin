import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { answersService } from '../services/answers-service';

export function useAnswers(postId: string) {
  return useQuery({
    queryKey: ['answers', postId],
    queryFn: () => answersService.findByPost(postId),
    enabled: Boolean(postId),
  });
}

export function useCreateAnswer(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => answersService.create(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', postId] });
    },
  });
}

export function useAcceptAnswer(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answerId: string) => answersService.accept(postId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', postId] });
    },
  });
}

/**
 * Voto con signo, no un toggle simple: tocar upvote de nuevo lo
 * retira; tocar downvote estando en upvote lo cambia. El estado local
 * (qué votaste vos) sigue el mismo patrón optimista que Likes/Saves.
 */
export function useVoteAnswer(postId: string, answerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: 1 | -1 | 0) =>
      value === 0 ? answersService.unvote(answerId) : answersService.vote(answerId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', postId] });
    },
  });
}
