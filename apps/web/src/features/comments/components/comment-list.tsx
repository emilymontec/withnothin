import { useComments } from '../hooks/use-comments';
import type { Comment } from '../services/comments-service';
import styles from './comment-list.module.css';

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <li className={styles.item}>
      {comment.isDeleted ? (
        <p className={styles.deleted}>[eliminado]</p>
      ) : (
        <>
          <span className={styles.author}>@{comment.author?.username}</span>
          <p className={styles.content}>{comment.content}</p>
        </>
      )}
    </li>
  );
}

export function CommentList({ postId }: { postId: string }) {
  const { data: comments = [], isLoading } = useComments(postId);

  if (isLoading) {
    return <p>Cargando comentarios...</p>;
  }

  if (comments.length === 0) {
    return <p className={styles.empty}>Todavía no hay comentarios. Sé el primero.</p>;
  }

  // Comentarios de primer nivel + sus respuestas directas, en orden
  // cronológico plano — un hilo con anidamiento profundo se revisita
  // si el volumen de comentarios lo empieza a justificar.
  const topLevel = comments.filter((c) => !c.parentCommentId);
  const repliesByParent = new Map<string, Comment[]>();
  for (const comment of comments) {
    if (comment.parentCommentId) {
      const list = repliesByParent.get(comment.parentCommentId) ?? [];
      list.push(comment);
      repliesByParent.set(comment.parentCommentId, list);
    }
  }

  return (
    <ul className={styles.list}>
      {topLevel.map((comment) => (
        <li key={comment.id}>
          <CommentItem comment={comment} />
          {repliesByParent.get(comment.id) && (
            <ul className={styles.replies}>
              {repliesByParent.get(comment.id)!.map((reply) => (
                <CommentItem key={reply.id} comment={reply} />
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
