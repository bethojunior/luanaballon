import type { Metadata } from 'next';
import { Fredoka, Nunito, Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });

export const metadata: Metadata = {
  title: { default: 'Luana Balões | Balões e decoração para sua festa', template: '%s | Luana Balões' },
  description: 'Balões, decoração e artigos para festas. Peça direto pelo WhatsApp!',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable} ${playfair.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
