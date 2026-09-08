'use client';

import styles from './multi-select.module.css';

export interface MultiSelectOption {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

/**
 * Selector múltiple genérico. No sabe qué es una "tecnología" o un
 * "tag" — solo trabaja con { id, label }. El conocimiento de dominio
 * vive en los componentes que lo envuelven (features/technologies,
 * features/tags).
 */
export function MultiSelect({ options, selectedIds, onChange }: MultiSelectProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <ul className={styles.list}>
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        return (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => toggle(option.id)}
              className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
              aria-pressed={isSelected}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
