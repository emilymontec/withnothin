'use client';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { useFollowers, useToggleFollow } from '../hooks/use-follows';
import { Button } from '@/components/ui/button';

export function FollowButton({ profileUserId }: { profileUserId: string }) {
  const { data: currentUser } = useCurrentUser();
  // Atajo simple para v1: se trae la lista completa de seguidores para
  // ver si el usuario actual está en ella. Si los perfiles empiezan a
  // tener miles de seguidores, esto debe reemplazarse por un endpoint
  // dedicado GET /users/:id/follow-status.
  const { data: followers = [] } = useFollowers(profileUserId);
  const toggleFollow = useToggleFollow(profileUserId);

  // No mostrar el botón en el propio perfil.
  if (!currentUser || currentUser.id === profileUserId) {
    return null;
  }

  const isFollowing = followers.some((f) => f.userId === currentUser.id);

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      onClick={() => toggleFollow.mutate(isFollowing)}
      disabled={toggleFollow.isPending}
    >
      {isFollowing ? 'Dejar de seguir' : 'Seguir'}
    </Button>
  );
}
