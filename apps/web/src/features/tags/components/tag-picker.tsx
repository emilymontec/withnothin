'use client';

import { useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useTagsSearch } from '../hooks/use-tags-search';

interface TagPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function TagPicker({ selectedIds, onChange }: TagPickerProps) {
  const [query, setQuery] = useState('');
  const { data: tags = [], isLoading } = useTagsSearch(query);

  return (
    <div>
      <label htmlFor="tag-search">Tags</label>
      <input
        id="tag-search"
        type="text"
        placeholder="Buscar tag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isLoading ? (
        <p>Buscando...</p>
      ) : (
        <MultiSelect
          // El backend resuelve tags por NOMBRE (find-or-create), no por id.
          options={tags.map((t) => ({ id: t.name, label: t.name }))}
          selectedIds={selectedIds}
          onChange={onChange}
        />
      )}
    </div>
  );
}
