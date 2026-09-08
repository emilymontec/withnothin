'use client';

import { useBlockedUsers, useToggleBlock } from '@/features/moderation/hooks/use-moderation';
import { Button } from '@/components/ui/button';

function UnblockRow({ userId, displayName, username }: { userId: string; displayName: string; username: string }) {
  const toggleBlock = useToggleBlock(userId);
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
      <span>
        {displayName} · @{username}
      </span>
      <Button variant="secondary" onClick={() => toggleBlock.mutate(true)}>
        Desbloquear
      </Button>
    </li>
  );
}

export default function BlockedUsersPage() {
  const { data: blocked = [], isLoading } = useBlockedUsers();

  return (
    <div>
      <h2>Usuarios bloqueados</h2>
      {isLoading && <p>Cargando...</p>}
      {!isLoading && blocked.length === 0 && <p>No has bloqueado a nadie.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {blocked.map((user) => (
          <UnblockRow
            key={user.userId}
            userId={user.userId}
            displayName={user.displayName}
            username={user.username}
          />
        ))}
      </ul>
    </div>
  );
}
