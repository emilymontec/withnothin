import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users-service';
import { useSession } from '@/features/auth/hooks/use-session';

export function useCurrentUser() {
  const { isAuthenticated } = useSession();

  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: usersService.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000, // el id/email del usuario no cambia en la sesión
  });
}
