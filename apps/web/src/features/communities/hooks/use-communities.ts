import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communitiesService } from '../services/communities-service';
import type { CreateCommunityInput } from '../services/communities-service';

export function useCommunities() {
  return useQuery({
    queryKey: ['communities', 'list'],
    queryFn: () => communitiesService.findMany(),
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: ['communities', slug],
    queryFn: () => communitiesService.getBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCommunityMembers(communityId: string) {
  return useQuery({
    queryKey: ['communities', communityId, 'members'],
    queryFn: () => communitiesService.getMembers(communityId),
    enabled: Boolean(communityId),
  });
}

export function useCommunityPosts(communityId: string) {
  return useQuery({
    queryKey: ['communities', communityId, 'posts'],
    queryFn: () => communitiesService.getPosts(communityId),
    enabled: Boolean(communityId),
  });
}

export function useCreateCommunity() {
  return useMutation({
    mutationFn: (input: CreateCommunityInput) => communitiesService.create(input),
  });
}

export function useToggleCommunityMembership(communityId: string, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isCurrentlyMember: boolean) =>
      isCurrentlyMember ? communitiesService.leave(communityId) : communitiesService.join(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities', slug] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId, 'members'] });
    },
  });
}
