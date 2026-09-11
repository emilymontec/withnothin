'use client';

import Link from 'next/link';
import { useCommunities } from '@/features/communities/hooks/use-communities';
import { CommunityCard } from '@/features/communities/components/community-card';
import buttonStyles from '@/components/ui/button.module.css';

export default function CommunitiesPage() {
  const { data: communities = [], isLoading } = useCommunities();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Comunidades</h2>
        <Link href="/communities/new" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
          Nueva comunidad
        </Link>
      </div>
      {isLoading && <p>Cargando...</p>}
      {!isLoading && communities.length === 0 && <p>Todavía no hay comunidades.</p>}
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}
