'use client';

import { useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useTechnologiesSearch } from '../hooks/use-technologies-search';

interface TechnologyPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function TechnologyPicker({ selectedIds, onChange }: TechnologyPickerProps) {
  const [query, setQuery] = useState('');
  const { data: technologies = [], isLoading } = useTechnologiesSearch(query);

  return (
    <div>
      <label htmlFor="technology-search">Tecnologías</label>
      <input
        id="technology-search"
        type="text"
        placeholder="Buscar tecnología..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isLoading ? (
        <p>Buscando...</p>
      ) : (
        <MultiSelect
          // El backend resuelve tecnologías por NOMBRE (find-or-create),
          // no por id — por eso el "id" del MultiSelect es el nombre.
          options={technologies.map((t) => ({ id: t.name, label: t.name }))}
          selectedIds={selectedIds}
          onChange={onChange}
        />
      )}
    </div>
  );
}
