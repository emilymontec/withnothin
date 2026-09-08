import { Logo } from '@/components/ui/logo';
import { ScribbleAccent } from '@/components/ui/scribble-accent';
import styles from './auth-layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Logo withTagline />
          <ScribbleAccent size={64} className={styles.scribble} />
        </div>
        {children}
      </div>
    </div>
  );
}
