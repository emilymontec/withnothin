'use client';

import { useState } from 'react';
import { useToggleBlock, useToggleMute } from '../hooks/use-moderation';
import { Button } from '@/components/ui/button';

interface ModerationActionsProps {
  profileUserId: string;
}

/**
 * Acciones "duras" de moderación sobre un usuario. Igual que
 * LikeButton/SaveButton, el estado de "ya bloqueado/silenciado" es
 * local por ahora — la API no expone esa bandera en el perfil público
 * todavía (mismo patrón documentado en el roadmap).
 */
export function ModerationActions({ profileUserId }: ModerationActionsProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const toggleBlock = useToggleBlock(profileUserId);
  const toggleMute = useToggleMute(profileUserId);

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button
        variant="secondary"
        onClick={() => {
          setIsMuted((prev) => !prev);
          toggleMute.mutate(isMuted);
        }}
      >
        {isMuted ? 'Dejar de silenciar' : 'Silenciar'}
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setIsBlocked((prev) => !prev);
          toggleBlock.mutate(isBlocked);
        }}
      >
        {isBlocked ? 'Desbloquear' : 'Bloquear'}
      </Button>
    </div>
  );
}
