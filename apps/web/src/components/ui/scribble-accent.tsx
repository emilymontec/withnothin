interface ScribbleAccentProps {
  size?: number;
  className?: string;
}

/**
 * Motivo decorativo recurrente de la marca: marcas sueltas (x, punto,
 * trazo, coma) dispuestas en un círculo flojo alrededor de un espacio
 * vacío — el mismo lenguaje visual que rodea a la mascota en el
 * brandboard, sin reproducir la ilustración de la mascota en sí.
 *
 * Uso previsto: estados vacíos, pantallas de auth, loaders.
 */
export function ScribbleAccent({ size = 96, className }: ScribbleAccentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 30 L20 38 M20 30 L12 38" />
      <path d="M46 8 L54 8" />
      <circle cx="80" cy="18" r="2" fill="currentColor" stroke="none" />
      <path d="M84 40 L92 34 M84 34 L92 40" />
      <path d="M8 62 Q14 58 18 62 T28 62" />
      <path d="M88 66 L94 74" />
      <circle cx="20" cy="82" r="2" fill="currentColor" stroke="none" />
      <path d="M46 90 Q52 84 58 90" />
    </svg>
  );
}
