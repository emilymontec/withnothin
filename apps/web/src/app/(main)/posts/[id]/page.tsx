'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePost } from '@/features/posts/hooks/use-posts';
import { PostTypeBadge } from '@/features/posts/components/post-type-badge';
import { LikeButton } from '@/features/posts/components/like-button';
import { SaveButton } from '@/features/saves/components/save-button';
import { CommentList } from '@/features/comments/components/comment-list';
import { CommentForm } from '@/features/comments/components/comment-form';
import styles from './post-detail.module.css';

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = usePost(params.id);

  if (isLoading) {
    return <p>Cargando post...</p>;
  }

  if (isError || !post) {
    return <p>No pudimos encontrar este post.</p>;
  }

  return (
    <article>
      <div className={styles.header}>
        <PostTypeBadge type={post.type} />
        <Link href={`/profiles/${post.author.username}`} className={styles.author}>
          @{post.author.username}
        </Link>
      </div>

      <p className={styles.content}>{post.content}</p>

      {post.technologies.length > 0 && (
        <ul className={styles.techList}>
          {post.technologies.map((tech) => (
            <li key={tech.id} className={styles.techChip}>
              {tech.name}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        <LikeButton postId={post.id} likesCount={post.likesCount} />
        <SaveButton postId={post.id} />
      </div>

      <hr className={styles.divider} />

      <h3>Comentarios</h3>
      <CommentForm postId={post.id} />
      <CommentList postId={post.id} />
    </article>
  );
}
