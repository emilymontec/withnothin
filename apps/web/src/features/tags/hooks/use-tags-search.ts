import { useQuery } from '@tanstack/react-query';
import { tagsService } from '../services/tags-service';

export function useTagsSearch(query: string) {
  return useQuery({
    queryKey: ['tags', query],
    queryFn: () => tagsService.search(query),
    staleTime: 60_000,
  });
}
