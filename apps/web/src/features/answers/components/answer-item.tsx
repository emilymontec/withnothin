import type { Answer } from '@withnothin/shared-types';
import { VoteButtons } from './vote-buttons';
import { Button } from '@/components/ui/button';
import { useAcceptAnswer } from '../hooks/use-answers';
import styles from './answer-item.module.css';

interface AnswerItemProps {
  postId: string;
  answer: Answer;
  canAccept: boolean;
}

export function AnswerItem({ postId, answer, canAccept }: AnswerItemProps) {
  const acceptAnswer = useAcceptAnswer(postId);

  return (
    <div className={`${styles.item} ${answer.isAccepted ? styles.accepted : ''}`}>
      <VoteButtons postId={postId} answerId={answer.id} votesScore={answer.votesScore} />
      <div className={styles.content}>
        {answer.isAccepted && <span className={styles.acceptedBadge}>✓ Respuesta aceptada</span>}
        <p>{answer.content}</p>
        <div className={styles.footer}>
          <span className={styles.author}>@{answer.author.username}</span>
          {canAccept && !answer.isAccepted && (
            <Button variant="secondary" onClick={() => acceptAnswer.mutate(answer.id)}>
              Marcar como aceptada
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
