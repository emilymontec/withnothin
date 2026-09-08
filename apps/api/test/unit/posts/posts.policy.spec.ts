import { ForbiddenException } from '@nestjs/common';
import { PostsPolicy } from '../../../src/modules/posts/policies/posts.policy';
import { Post } from '@prisma/client';

describe('PostsPolicy', () => {
  let policy: PostsPolicy;

  beforeEach(() => {
    policy = new PostsPolicy();
  });

  it('permite modificar si el usuario es el autor', () => {
    const post = { authorId: 'user-1' } as Post;
    expect(() => policy.assertCanModify(post, 'user-1')).not.toThrow();
  });

  it('rechaza modificar si el usuario NO es el autor', () => {
    const post = { authorId: 'user-1' } as Post;
    expect(() => policy.assertCanModify(post, 'user-2')).toThrow(ForbiddenException);
  });
});
