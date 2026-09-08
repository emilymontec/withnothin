import Link from 'next/link';
import type { Project } from '@withnothin/shared-types';
import styles from './project-card.module.css';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <Link href={`/projects/${project.id}`} className={styles.title}>
        <h3>{project.name}</h3>
      </Link>
      <span className={styles.owner}>por @{project.owner.username}</span>
      {project.description && <p>{project.description}</p>}
      {project.technologies.length > 0 && (
        <ul className={styles.techList}>
          {project.technologies.map((tech) => (
            <li key={tech.id} className={styles.techChip}>
              {tech.name}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
