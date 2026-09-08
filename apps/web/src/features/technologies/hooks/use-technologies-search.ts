import { useQuery } from '@tanstack/react-query';
import { technologiesService } from '../services/technologies-service';

export function useTechnologiesSearch(query: string) {
  return useQuery({
    queryKey: ['technologies', query],
    queryFn: () => technologiesService.search(query),
    staleTime: 60_000, // el catálogo cambia poco; evita refetch en cada tecleo
  });
}
