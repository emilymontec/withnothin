import Link from 'next/link';
import type { Post } from '@withnothin/shared-types';
import { PostTypeBadge } from './post-type-badge';
import { ReportButton } from '@/features/moderation/components/report-button';
import styles from './post-card.module.css';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <PostTypeBadge type={post.type} />
        <Link href={`/profiles/${post.author.username}`} className={styles.author}>
          @{post.author.username}
        </Link>
      </div>
      <Link href={`/posts/${post.id}`} className={styles.content}>
        <p>{post.content}</p>
      </Link>
      {post.technologies.length > 0 && (
        <ul className={styles.techList}>
          {post.technologies.map((tech) => (
            <li key={tech.id} className={styles.techChip}>
              {tech.name}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.footer}>
        <span>{post.likesCount} likes</span>
        <span>{post.commentsCount} comentarios</span>
        <ReportButton targetType="POST" targetId={post.id} />
      </div>
    </article>
  );
}
