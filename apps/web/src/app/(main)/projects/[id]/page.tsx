'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProject, useUpdateProject, useDeleteProject } from '@/features/projects/hooks/use-projects';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import styles from './project-detail.module.css';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProject(params.id);
  const { data: currentUser } = useCurrentUser();
  const updateProject = useUpdateProject(params.id);
  const deleteProject = useDeleteProject();

  if (isLoading) {
    return <p>Cargando proyecto...</p>;
  }

  if (isError || !project) {
    return <p>No pudimos encontrar este proyecto.</p>;
  }

  const isOwner = currentUser?.id === project.owner.id;

  return (
    <article>
      <div className={styles.header}>
        <h2>{project.name}</h2>
        <Link href={`/profiles/${project.owner.username}`} className={styles.owner}>
          por @{project.owner.username}
        </Link>
      </div>

      {project.status === 'ARCHIVED' && <span className={styles.archivedBadge}>Archivado</span>}

      {project.description && <p className={styles.description}>{project.description}</p>}

      {project.technologies.length > 0 && (
        <ul className={styles.techList}>
          {project.technologies.map((tech) => (
            <li key={tech.id} className={styles.techChip}>
              {tech.name}
            </li>
          ))}
        </ul>
      )}

      {project.links.length > 0 && (
        <ul className={styles.linkList}>
          {project.links.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.members}>
        <h3>Miembros</h3>
        <ul>
          {project.members.map((member) => (
            <li key={member.userId}>
              <Link href={`/profiles/${member.username}`}>@{member.username}</Link>
              {member.role === 'OWNER' && <span className={styles.ownerTag}> · dueño</span>}
            </li>
          ))}
        </ul>
      </div>

      {isOwner && (
        <div className={styles.ownerActions}>
          <Button
            variant="secondary"
            onClick={() =>
              updateProject.mutate({ status: project.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' })
            }
          >
            {project.status === 'ACTIVE' ? 'Archivar' : 'Reactivar'}
          </Button>
          <Button variant="secondary" onClick={() => deleteProject.mutate(project.id)}>
            Eliminar proyecto
          </Button>
        </div>
      )}
    </article>
  );
}
