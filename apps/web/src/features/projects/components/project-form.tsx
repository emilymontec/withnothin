'use client';

import { useState } from 'react';
import { TechnologyPicker } from '@/features/technologies/components/technology-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CreateProjectInput } from '../services/projects-service';
import styles from './project-form.module.css';

interface ProjectFormProps {
  onSubmit: (input: CreateProjectInput) => Promise<void>;
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addLink() {
    setLinks((prev) => [...prev, { label: '', url: '' }]);
  }

  function updateLink(index: number, field: 'label' | 'url', value: string) {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('El nombre del proyecto es muy corto');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        description: description || undefined,
        technologies,
        links: links.filter((l) => l.label && l.url),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos crear el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input id="name" label="Nombre del proyecto" value={name} onChange={(e) => setName(e.target.value)} required />

      <div>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={2000}
        />
      </div>

      <TechnologyPicker selectedIds={technologies} onChange={setTechnologies} />

      <div>
        <label>Links</label>
        {links.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <input
              type="text"
              placeholder="Label (ej. GitHub)"
              value={link.label}
              onChange={(e) => updateLink(index, 'label', e.target.value)}
              className={styles.linkInput}
            />
            <input
              type="url"
              placeholder="https://..."
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              className={styles.linkInput}
            />
            <button type="button" onClick={() => removeLink(index)} className={styles.removeLink}>
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={addLink} className={styles.addLink}>
          + Agregar link
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creando...' : 'Crear proyecto'}
      </Button>
    </form>
  );
}
