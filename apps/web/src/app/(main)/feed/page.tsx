'use client';

import { useFeed } from '@/features/posts/hooks/use-posts';
import { PostCard } from '@/features/posts/components/post-card';
import { SuggestionsPanel } from '@/features/recommendations/components/suggestions-panel';

export default function FeedPage() {
  // Feed cronológico: posts propios + de usuarios seguidos. La
  // paginación por cursor infinita (scroll) queda para cuando el
  // volumen de posts la justifique — hoy trae la primera página.
  const { data: posts = [], isLoading } = useFeed();

  return (
    <div>
      <h2>Feed</h2>
      <SuggestionsPanel />
      {isLoading && <p>Cargando...</p>}
      {!isLoading && posts.length === 0 && (
        <p>Tu feed está vacío. Sigue a alguien o publica algo para empezar.</p>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
