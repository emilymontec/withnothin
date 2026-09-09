import { useAnswers } from '../hooks/use-answers';
import { AnswerItem } from './answer-item';

interface AnswerListProps {
  postId: string;
  canAccept: boolean;
}

export function AnswerList({ postId, canAccept }: AnswerListProps) {
  const { data: answers = [], isLoading } = useAnswers(postId);

  if (isLoading) {
    return <p>Cargando respuestas...</p>;
  }

  if (answers.length === 0) {
    return <p>Todavía no hay respuestas. Sé el primero.</p>;
  }

  return (
    <div>
      {answers.map((answer) => (
        <AnswerItem key={answer.id} postId={postId} answer={answer} canAccept={canAccept} />
      ))}
    </div>
  );
}
