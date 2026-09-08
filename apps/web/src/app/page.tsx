import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ScribbleAccent } from '@/components/ui/scribble-accent';
import buttonStyles from '@/components/ui/button.module.css';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.hero}>
      <ScribbleAccent size={72} className={styles.scribble} />
      <Logo />
      <h1>Everyone starts with nothin.</h1>
      <p>
        Comparte lo que estás construyendo, lo que estás aprendiendo y en qué te
        quedaste atascado. Sin pulir, sin fingir que ya lo sabes todo.
      </p>
      <div className={styles.actions}>
        <Link href="/register" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
          Crear cuenta
        </Link>
        <Link href="/login" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
          Ya tengo cuenta
        </Link>
      </div>
    </main>
  );
}
