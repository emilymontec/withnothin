import { ButtonHTMLAttributes } from 'react';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/**
 * Trazo grueso, plano, sin sombra — igual que el arte de línea del
 * mascot del brandboard. "primary" = ink sólido; "secondary" = solo
 * contorno. No hay una tercera variante "ghost/text": el brandboard
 * es binario (blanco/negro), así que el sistema de botones también.
 */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const variantClass = variant === 'primary' ? styles.primary : styles.secondary;
  return <button className={[styles.button, variantClass, className].filter(Boolean).join(' ')} {...props} />;
}
