import { apiClient } from '@/lib/api-client';
import type { Project } from '@withnothin/shared-types';

export interface CreateProjectInput {
  name: string;
  description?: string;
  technologies?: string[];
  links?: Array<{ label: string; url: string }>;
}

interface FindProjectsParams {
  cursor?: string;
  ownerId?: string;
  technology?: string;
}

function buildQuery(params: FindProjectsParams): string {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.ownerId) searchParams.set('ownerId', params.ownerId);
  if (params.technology) searchParams.set('technology', params.technology);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const projectsService = {
  create: (input: CreateProjectInput) => apiClient.post<Project>('/projects', input),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  findMany: (params: FindProjectsParams = {}) =>
    apiClient.get<Project[]>(`/projects${buildQuery(params)}`),
  update: (id: string, input: Partial<CreateProjectInput> & { status?: string }) =>
    apiClient.patch<Project>(`/projects/${id}`, input),
  remove: (id: string) => apiClient.delete<void>(`/projects/${id}`),
  addMember: (projectId: string, userId: string) =>
    apiClient.post<Project>(`/projects/${projectId}/members`, { userId }),
  removeMember: (projectId: string, userId: string) =>
    apiClient.delete<Project>(`/projects/${projectId}/members/${userId}`),
};
