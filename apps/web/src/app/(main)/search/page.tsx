'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearch } from '@/features/search/hooks/use-search';
import { PostCard } from '@/features/posts/components/post-card';
import { Input } from '@/components/ui/input';
import styles from './search.module.css';

export default function SearchPage() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');

  // Debounce simple: evita disparar una búsqueda por cada tecla.
  useEffect(() => {
    const timeout = setTimeout(() => setQuery(inputValue), 300);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  const { data: results, isLoading } = useSearch(query);

  return (
    <div>
      <h2>Buscar</h2>
      <Input
        id="search"
        label="Posts, personas o tecnologías"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="kotlin, @alguien, 'me atasqué con...'"
      />

      {isLoading && <p>Buscando...</p>}

      {results?.profiles && results.profiles.length > 0 && (
        <section>
          <h3>Personas</h3>
          <ul className={styles.profileList}>
            {results.profiles.map((profile) => (
              <li key={profile.userId}>
                <Link href={`/profiles/${profile.username}`}>
                  {profile.displayName} · @{profile.username}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results?.technologies && results.technologies.length > 0 && (
        <section>
          <h3>Tecnologías</h3>
          <ul className={styles.techList}>
            {results.technologies.map((tech) => (
              <li key={tech.id} className={styles.techChip}>
                {tech.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {results?.posts && results.posts.length > 0 && (
        <section>
          <h3>Posts</h3>
          {results.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      {query && !isLoading && !results?.posts?.length && !results?.profiles?.length && !results?.technologies?.length && (
        <p>Sin resultados para &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
