'use client';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { useToggleFollow } from '../hooks/use-follows';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
  profileUserId: string;
  username: string;
  isFollowedByCurrentUser: boolean;
}

/**
 * Antes traía la lista completa de seguidores solo para ver si el
 * usuario actual estaba adentro (no escala, y rompe en cuanto esa
 * lista se pagine). Ahora recibe el estado real directo del perfil
 * (profile.isFollowedByCurrentUser), que la API ya calcula.
 */
export function FollowButton({ profileUserId, username, isFollowedByCurrentUser }: FollowButtonProps) {
  const { data: currentUser } = useCurrentUser();
  const toggleFollow = useToggleFollow(profileUserId, username);

  // No mostrar el botón en el propio perfil.
  if (!currentUser || currentUser.id === profileUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowedByCurrentUser ? 'secondary' : 'primary'}
      onClick={() => toggleFollow.mutate(isFollowedByCurrentUser)}
      disabled={toggleFollow.isPending}
    >
      {isFollowedByCurrentUser ? 'Dejar de seguir' : 'Seguir'}
    </Button>
  );
}
