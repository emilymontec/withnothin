'use client';

import { useState } from 'react';
import { useVoteAnswer } from '../hooks/use-answers';
import styles from './vote-buttons.module.css';

interface VoteButtonsProps {
  postId: string;
  answerId: string;
  votesScore: number;
}

export function VoteButtons({ postId, answerId, votesScore }: VoteButtonsProps) {
  const [myVote, setMyVote] = useState<1 | -1 | 0>(0);
  const vote = useVoteAnswer(postId, answerId);

  function handleVote(value: 1 | -1) {
    const newVote = myVote === value ? 0 : value;
    setMyVote(newVote);
    vote.mutate(newVote);
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={`${styles.button} ${myVote === 1 ? styles.active : ''}`}
        aria-label="Votar a favor"
      >
        ▲
      </button>
      <span className={styles.score}>{votesScore}</span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={`${styles.button} ${myVote === -1 ? styles.active : ''}`}
        aria-label="Votar en contra"
      >
        ▼
      </button>
    </div>
  );
}
