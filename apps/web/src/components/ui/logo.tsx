import styles from './logo.module.css';

interface LogoProps {
  withTagline?: boolean;
}

export function Logo({ withTagline = false }: LogoProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.mark}>WithNothin</span>
      {withTagline && <span className={styles.tagline}>A tech community</span>}
    </div>
  );
}
