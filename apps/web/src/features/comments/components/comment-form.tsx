'use client';

import { useState } from 'react';
import { useCreateComment } from '../hooks/use-comments';
import { Button } from '@/components/ui/button';
import styles from './comment-form.module.css';

export function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState('');
  const createComment = useCreateComment(postId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length === 0) return;

    await createComment.mutateAsync({ content });
    setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        className={styles.textarea}
        placeholder="Escribe un comentario..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        maxLength={2000}
      />
      <Button type="submit" disabled={createComment.isPending}>
        {createComment.isPending ? 'Enviando...' : 'Comentar'}
      </Button>
    </form>
  );
}
