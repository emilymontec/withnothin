'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/features/auth/hooks/use-session';
import { useUnreadCount } from '@/features/notifications/hooks/use-notifications';
import { Logo } from '@/components/ui/logo';
import buttonStyles from '@/components/ui/button.module.css';
import styles from './main-layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useSession();
  const router = useRouter();
  const { data: unreadCount = 0 } = useUnreadCount();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  // Evita destello de contenido protegido mientras se resuelve la sesión.
  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link href="/feed" className={styles.logoLink}>
          <Logo />
        </Link>
        <nav className={styles.nav}>
          <Link href="/search" className={styles.navLink}>
            Buscar
          </Link>
          <Link href="/projects" className={styles.navLink}>
            Proyectos
          </Link>
          <Link href="/saves" className={styles.navLink}>
            Guardados
          </Link>
          <Link href="/notifications" className={styles.navLink}>
            Notificaciones{unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>
          <Link href="/posts/new" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
            Nuevo post
          </Link>
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
