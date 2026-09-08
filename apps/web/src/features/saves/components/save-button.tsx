'use client';

import { useState } from 'react';
import { useToggleSave } from '../hooks/use-saves';
import styles from './save-button.module.css';

export function SaveButton({ postId }: { postId: string }) {
  // Mismo enfoque que LikeButton: estado local optimista porque la
  // API todavía no informa isSavedByCurrentUser en la respuesta del post.
  const [isSaved, setIsSaved] = useState(false);
  const toggleSave = useToggleSave(postId);

  function handleClick() {
    setIsSaved((prev) => !prev);
    toggleSave.mutate(isSaved);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${isSaved ? styles.saved : ''}`}
      aria-pressed={isSaved}
    >
      {isSaved ? '★ Guardado' : '☆ Guardar'}
    </button>
  );
}
