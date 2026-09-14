import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppProviders } from './providers';
import './globals.css';

// Josefin Sans — bundle local (variable font, SIL OFL, ver
// assets/fonts/OFL-JosefinSans.txt), igual que en Android
// (res/font/josefin_sans.ttf). Antes se cargaba vía next/font/google,
// que reintroduce en el build web justo la dependencia de red que se
// evitó a propósito del lado de Android — ver AUDITORIA-fase12.md.
const josefinSans = localFont({
  src: '../assets/fonts/JosefinSans-Variable.ttf',
  variable: '--font-josefin-sans',
  weight: '100 700',
  display: 'swap',
});

// Bristol — archivo de fuente real provisto por el equipo de diseño.
// Reemplaza al sustituto (Patrick Hand) que se usaba mientras no
// estaba disponible el archivo con licencia web.
const bristol = localFont({
  src: '../assets/fonts/Bristol.otf',
  variable: '--font-bristol',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WithNothin',
  description: 'Everyone starts with nothin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${josefinSans.variable} ${bristol.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
