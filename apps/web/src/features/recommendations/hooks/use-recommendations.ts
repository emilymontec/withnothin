import { useQuery } from '@tanstack/react-query';
import { recommendationsService } from '../services/recommendations-service';

export function useSuggestedUsers() {
  return useQuery({
    queryKey: ['recommendations', 'users'],
    queryFn: recommendationsService.getSuggestedUsers,
  });
}

export function useSuggestedTechnologies() {
  return useQuery({
    queryKey: ['recommendations', 'technologies'],
    queryFn: recommendationsService.getSuggestedTechnologies,
  });
}
