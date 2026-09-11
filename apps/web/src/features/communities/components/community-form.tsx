'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CreateCommunityInput } from '../services/communities-service';

interface CommunityFormProps {
  onSubmit: (input: CreateCommunityInput) => Promise<void>;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CommunityForm({ onSubmit }: CommunityFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value)); // autocompleta, pero el usuario puede editarlo después
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || slug.trim().length < 3) {
      setError('Completa nombre y slug válidos');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ name, slug, description: description || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos crear la comunidad');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input id="name" label="Nombre" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
      <Input
        id="slug"
        label="Slug (URL)"
        value={slug}
        onChange={(e) => setSlug(slugify(e.target.value))}
        required
      />
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={1000}
          style={{ width: '100%' }}
        />
      </div>
      {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creando...' : 'Crear comunidad'}
      </Button>
    </form>
  );
}
