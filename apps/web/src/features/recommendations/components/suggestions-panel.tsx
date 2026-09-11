'use client';

import Link from 'next/link';
import { useSuggestedUsers, useSuggestedTechnologies } from '../hooks/use-recommendations';
import styles from './suggestions-panel.module.css';

export function SuggestionsPanel() {
  const { data: users = [] } = useSuggestedUsers();
  const { data: technologies = [] } = useSuggestedTechnologies();

  if (users.length === 0 && technologies.length === 0) {
    return null;
  }

  return (
    <aside className={styles.panel}>
      {users.length > 0 && (
        <div className={styles.section}>
          <h4>Gente que podrías seguir</h4>
          <ul className={styles.list}>
            {users.map((user) => (
              <li key={user.userId}>
                <Link href={`/profiles/${user.username}`}>{user.displayName}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {technologies.length > 0 && (
        <div className={styles.section}>
          <h4>Tecnologías populares</h4>
          <ul className={styles.chipList}>
            {technologies.map((tech) => (
              <li key={tech.id} className={styles.chip}>
                {tech.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
