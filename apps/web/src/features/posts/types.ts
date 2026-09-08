import type { Post, PostAuthor, PostMediaRef, PostTagRef, PostTechnologyRef } from '@withnothin/shared-types';
import { PostType, PostVisibility } from '@withnothin/shared-types';

export type { Post, PostAuthor, PostMediaRef, PostTagRef, PostTechnologyRef };
export { PostType, PostVisibility };

export interface CreatePostInput {
  type: PostType;
  content: string;
  visibility?: PostVisibility;
  technologies?: string[];
  tags?: string[];
  mediaIds?: string[];
  metadata?: Record<string, unknown>;
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.BUILD]: 'Construí esto',
  [PostType.LEARN]: 'Estoy aprendiendo',
  [PostType.STUCK]: 'Estoy atascado',
  [PostType.QUESTION]: 'Pregunta',
  [PostType.IDEA]: 'Idea',
  [PostType.SHOWCASE]: 'Showcase',
  [PostType.DISCOVER]: 'Descubrimiento',
};
