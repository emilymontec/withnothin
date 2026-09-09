import { ForbiddenException } from '@nestjs/common';
import { AnswersPolicy } from '../../../src/modules/answers/policies/answers.policy';
import { Post } from '@prisma/client';

describe('AnswersPolicy', () => {
  let policy: AnswersPolicy;

  beforeEach(() => {
    policy = new AnswersPolicy();
  });

  it('permite aceptar si el usuario es el autor de la pregunta', () => {
    const post = { authorId: 'user-1' } as Post;
    expect(() => policy.assertCanAccept(post, 'user-1')).not.toThrow();
  });

  it('rechaza aceptar si el usuario NO es el autor de la pregunta', () => {
    const post = { authorId: 'user-1' } as Post;
    expect(() => policy.assertCanAccept(post, 'user-2')).toThrow(ForbiddenException);
  });
});
