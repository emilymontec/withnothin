import Link from 'next/link';
import type { Community } from '@withnothin/shared-types';
import styles from './community-card.module.css';

export function CommunityCard({ community }: { community: Community }) {
  return (
    <Link href={`/communities/${community.slug}`} className={styles.card}>
      <h3>{community.name}</h3>
      {community.description && <p>{community.description}</p>}
      <span className={styles.meta}>{community.membersCount} miembros</span>
    </Link>
  );
}
