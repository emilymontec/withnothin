'use client';

import { useAdminUsers, useToggleUserActive } from '@/features/admin/hooks/use-admin';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAdminUsers();
  const toggleActive = useToggleUserActive();

  return (
    <div>
      <h2>Usuarios</h2>
      {isLoading && <p>Cargando...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Email</th>
            <th style={{ textAlign: 'left' }}>Username</th>
            <th style={{ textAlign: 'left' }}>Rol</th>
            <th style={{ textAlign: 'left' }}>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.username ?? '—'}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Activo' : 'Desactivado'}</td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => toggleActive.mutate({ userId: user.id, isActive: user.isActive })}
                >
                  {user.isActive ? 'Desactivar' : 'Reactivar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
