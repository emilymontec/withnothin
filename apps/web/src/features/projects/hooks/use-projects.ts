import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services/projects-service';
import type { CreateProjectInput } from '../services/projects-service';

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsService.getById(id),
    enabled: Boolean(id),
  });
}

export function useProjects(params: { ownerId?: string; technology?: string } = {}) {
  return useQuery({
    queryKey: ['projects', 'list', params],
    queryFn: () => projectsService.findMany(params),
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsService.create(input),
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CreateProjectInput> & { status?: string }) =>
      projectsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      queryClient.removeQueries({ queryKey: ['projects', id] });
    },
  });
}
