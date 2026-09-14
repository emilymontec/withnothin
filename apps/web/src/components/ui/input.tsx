import { InputHTMLAttributes, forwardRef, useId } from 'react';
import styles from './input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    // useId en vez de un string fijo para el error: si el mismo
    // componente se usa más de una vez en la página, dos mensajes de
    // error no pueden compartir el mismo id de todos modos.
    const generatedErrorId = useId();
    const errorId = error ? `${id ?? generatedErrorId}-error` : undefined;

    return (
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <input
          ref={ref}
          id={id}
          className={[styles.input, className].filter(Boolean).join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
