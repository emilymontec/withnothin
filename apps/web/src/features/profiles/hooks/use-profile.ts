import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profilesService } from '../services/profiles-service';
import type { CreateProfileInput } from '../types';

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profilesService.getMine,
    retry: false, // 404 legítimo si el usuario aún no completó el onboarding
  });
}

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => profilesService.getByUsername(username),
    enabled: Boolean(username),
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProfileInput) => profilesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
