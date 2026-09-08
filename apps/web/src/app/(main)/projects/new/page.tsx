'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/features/projects/components/project-form';
import { useCreateProject } from '@/features/projects/hooks/use-projects';
import type { CreateProjectInput } from '@/features/projects/services/projects-service';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  async function handleSubmit(input: CreateProjectInput) {
    const project = await createProject.mutateAsync(input);
    router.push(`/projects/${project.id}`);
  }

  return (
    <>
      <h2>Nuevo proyecto</h2>
      <ProjectForm onSubmit={handleSubmit} />
    </>
  );
}
