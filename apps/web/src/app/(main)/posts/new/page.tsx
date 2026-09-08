'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from '@/features/posts/components/post-form';
import { useCreatePost } from '@/features/posts/hooks/use-posts';
import type { CreatePostInput } from '@/features/posts/types';

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useCreatePost();

  async function handleSubmit(input: CreatePostInput) {
    const post = await createPost.mutateAsync(input);
    router.push(`/posts/${post.id}`);
  }

  return (
    <>
      <h2>Nuevo post</h2>
      <PostForm onSubmit={handleSubmit} />
    </>
  );
}
