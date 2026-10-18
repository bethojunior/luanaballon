import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito, Playfair_Display, Space_Grotesk } from 'next/font/google';
import { siteMetadata } from '@/lib/seo';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { getSettings } from '@/lib/data';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });

export const viewport: Viewport = { themeColor: '#FF3D8B' };

export const generateMetadata = (): Promise<Metadata> => siteMetadata();

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${nunito.variable} ${playfair.variable} ${grotesk.variable}`}>
      <body>
        {children}
        <PwaRegister />
        <PwaInstallPrompt name={s.storeName} />
      </body>
    </html>
  );
}
