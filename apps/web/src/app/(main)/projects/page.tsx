'use client';

import Link from 'next/link';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { ProjectCard } from '@/features/projects/components/project-card';
import buttonStyles from '@/components/ui/button.module.css';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Proyectos</h2>
        <Link href="/projects/new" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
          Nuevo proyecto
        </Link>
      </div>
      {isLoading && <p>Cargando...</p>}
      {!isLoading && projects.length === 0 && <p>Todavía no hay proyectos publicados.</p>}
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
