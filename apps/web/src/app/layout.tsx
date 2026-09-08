import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { AppProviders } from './providers';
import './globals.css';

// Josefin Sans = tipografía "Josefin" del brandboard, exacta.
const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-josefin-sans',
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
