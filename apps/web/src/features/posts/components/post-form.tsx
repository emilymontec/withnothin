'use client';

import { useState } from 'react';
import { TechnologyPicker } from '@/features/technologies/components/technology-picker';
import { TagPicker } from '@/features/tags/components/tag-picker';
import { Button } from '@/components/ui/button';
import { PostType, POST_TYPE_LABELS } from '../types';
import type { CreatePostInput } from '../types';
import styles from './post-form.module.css';

interface PostFormProps {
  onSubmit: (input: CreatePostInput) => Promise<void>;
}

const ALL_TYPES = Object.values(PostType);

export function PostForm({ onSubmit }: PostFormProps) {
  const [type, setType] = useState<PostType>(PostType.BUILD);
  const [content, setContent] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length === 0) {
      setError('Escribe algo antes de publicar');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ type, content, technologies, tags });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos publicar tu post');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.typeSelector}>
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`${styles.typeOption} ${type === t ? styles.typeOptionActive : ''}`}
          >
            {POST_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        placeholder="¿Qué estás construyendo, aprendiendo o en qué te atascaste?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        maxLength={5000}
      />

      <TechnologyPicker selectedIds={technologies} onChange={setTechnologies} />
      <TagPicker selectedIds={tags} onChange={setTags} />

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Publicando...' : 'Publicar'}
      </Button>
    </form>
  );
}
