'use client';

import { useState } from 'react';
import { useCreateAnswer } from '../hooks/use-answers';
import { Button } from '@/components/ui/button';
import styles from './answer-form.module.css';

export function AnswerForm({ postId }: { postId: string }) {
  const [content, setContent] = useState('');
  const createAnswer = useCreateAnswer(postId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length === 0) return;
    await createAnswer.mutateAsync(content);
    setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        className={styles.textarea}
        placeholder="Escribe tu respuesta..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={5000}
      />
      <Button type="submit" disabled={createAnswer.isPending}>
        {createAnswer.isPending ? 'Enviando...' : 'Responder'}
      </Button>
    </form>
  );
}
