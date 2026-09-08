import { apiClient } from '@/lib/api-client';
import type { Post } from '@withnothin/shared-types';

export interface SearchProfileResult {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface SearchTechnologyResult {
  id: string;
  name: string;
  slug: string;
}

export interface SearchResults {
  posts?: Post[];
  profiles?: SearchProfileResult[];
  technologies?: SearchTechnologyResult[];
}

export const searchService = {
  search: (q: string) => apiClient.get<SearchResults>(`/search?q=${encodeURIComponent(q)}`),
};
