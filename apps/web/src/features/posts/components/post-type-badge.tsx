import { PostType, POST_TYPE_LABELS } from '../types';
import styles from './post-type-badge.module.css';

export function PostTypeBadge({ type }: { type: PostType | string }) {
  const label = POST_TYPE_LABELS[type as PostType] ?? type;
  return <span className={styles.badge}>{label}</span>;
}
