'use client';

import { useState } from 'react';
import { useToggleLike } from '../hooks/use-posts';
import styles from './like-button.module.css';

interface LikeButtonProps {
  postId: string;
  likesCount: number;
}

export function LikeButton({ postId, likesCount }: LikeButtonProps) {
  // Estado local de "me gusta" porque la API no expone todavía
  // isLikedByCurrentUser en la respuesta del post — se agrega si
  // se vuelve necesario (ver decisiones pendientes del roadmap).
  const [isLiked, setIsLiked] = useState(false);
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
