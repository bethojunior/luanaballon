import type { Metadata } from 'next';
import { Fredoka, Nunito, Playfair_Display, Space_Grotesk } from 'next/font/google';
import { siteMetadata } from '@/lib/seo';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });

export const generateMetadata = (): Promise<Metadata> => siteMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable} ${playfair.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
