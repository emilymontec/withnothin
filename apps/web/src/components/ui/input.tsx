import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <input ref={ref} id={id} className={[styles.input, className].filter(Boolean).join(' ')} {...props} />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
