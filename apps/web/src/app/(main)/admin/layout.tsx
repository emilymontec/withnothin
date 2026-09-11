'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  // Protección real está en el backend (RolesGuard) — esto solo evita
  // mostrar la UI a quien no la necesita, no es un límite de seguridad.
  if (currentUser?.role !== 'ADMIN') {
    return <p>No tienes acceso a esta sección.</p>;
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/users">Usuarios</Link>
        <Link href="/admin/reports">Reportes</Link>
      </nav>
      {children}
    </div>
  );
}
