'use client';

import { useMySaves } from '@/features/saves/hooks/use-saves';
import { PostCard } from '@/features/posts/components/post-card';

export default function SavesPage() {
  const { data: posts = [], isLoading } = useMySaves();

  return (
    <div>
      <h2>Guardados</h2>
      {isLoading && <p>Cargando...</p>}
      {!isLoading && posts.length === 0 && <p>Todavía no guardaste ningún post.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
