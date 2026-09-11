'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  useCommunity,
  useCommunityMembers,
  useCommunityPosts,
  useToggleCommunityMembership,
} from '@/features/communities/hooks/use-communities';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { PostCard } from '@/features/posts/components/post-card';
import { Button } from '@/components/ui/button';
import styles from './community-detail.module.css';

export default function CommunityDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data: community, isLoading, isError } = useCommunity(params.slug);
  const { data: members = [] } = useCommunityMembers(community?.id ?? '');
  const { data: posts = [] } = useCommunityPosts(community?.id ?? '');
  const { data: currentUser } = useCurrentUser();
  const [isMemberOverride, setIsMemberOverride] = useState<boolean | null>(null);
  const toggleMembership = useToggleCommunityMembership(community?.id ?? '', params.slug);

  if (isLoading) {
    return <p>Cargando comunidad...</p>;
  }

  if (isError || !community) {
    return <p>No encontramos esta comunidad.</p>;
  }

  const isOwner = currentUser?.id === community.owner.id;
  const isMember = isMemberOverride ?? members.some((m) => m.userId === currentUser?.id);

  function handleToggle() {
    setIsMemberOverride(!isMember);
    toggleMembership.mutate(isMember);
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>{community.name}</h2>
          <p className={styles.meta}>
            {community.membersCount} miembros · creada por @{community.owner.username}
          </p>
          {community.description && <p>{community.description}</p>}
        </div>
        {!isOwner && (
          <Button variant={isMember ? 'secondary' : 'primary'} onClick={handleToggle}>
            {isMember ? 'Salir' : 'Unirme'}
          </Button>
        )}
      </div>

      <hr className={styles.divider} />

      <h3>Posts</h3>
      {!isMember && !isOwner && <p>Únete a la comunidad para publicar aquí.</p>}
      {posts.length === 0 && <p>Todavía no hay posts en esta comunidad.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
