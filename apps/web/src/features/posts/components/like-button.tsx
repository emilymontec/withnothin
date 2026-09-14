'use client';

import { useEffect, useState } from 'react';
import { useToggleLike } from '../hooks/use-posts';
import styles from './like-button.module.css';

interface LikeButtonProps {
  postId: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
}

export function LikeButton({ postId, likesCount, isLikedByCurrentUser }: LikeButtonProps) {
  // La API ya expone isLikedByCurrentUser (antes no, y este botón
  // arrancaba siempre en "no me gusta" sin importar el estado real).
  // Se mantiene estado local solo para el toggle optimista al hacer
  // click, resincronizado si el servidor devuelve otra cosa.
  const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);

  useEffect(() => {
    setIsLiked(isLikedByCurrentUser);
  }, [isLikedByCurrentUser]);

  const toggleLike = useToggleLike(postId);

  function handleClick() {
    setIsLiked((prev) => !prev);
    toggleLike.mutate(isLiked);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${isLiked ? styles.liked : ''}`}
      aria-pressed={isLiked}
    >
      {isLiked ? '♥' : '♡'} {likesCount}
    </button>
  );
}
