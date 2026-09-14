'use client';

import { useEffect, useState } from 'react';
import { useToggleSave } from '../hooks/use-saves';
import styles from './save-button.module.css';

interface SaveButtonProps {
  postId: string;
  isSavedByCurrentUser: boolean;
}

export function SaveButton({ postId, isSavedByCurrentUser }: SaveButtonProps) {
  // La API ya expone isSavedByCurrentUser (antes no, y este botón
  // arrancaba siempre en "no guardado" sin importar el estado real —
  // mismo bug que tenía LikeButton, ver AUDITORIA-fase12.md).
  const [isSaved, setIsSaved] = useState(isSavedByCurrentUser);

  useEffect(() => {
    setIsSaved(isSavedByCurrentUser);
  }, [isSavedByCurrentUser]);

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
