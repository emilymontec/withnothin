import { apiClient } from '@/lib/api-client';
import type { FollowUser } from '@/features/follows/services/follows-service';

export interface TechnologySuggestion {
  id: string;
  name: string;
  slug: string;
}

export const recommendationsService = {
  getSuggestedUsers: () => apiClient.get<FollowUser[]>('/recommendations/users'),
  getSuggestedTechnologies: () => apiClient.get<TechnologySuggestion[]>('/recommendations/technologies'),
};
