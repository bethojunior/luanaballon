import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import { getSettings } from '@/lib/data';
import { normalizeTheme } from '@/lib/themes';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const theme = normalizeTheme(s.layout);
  return (
    <div data-theme={theme}>
      <CartProvider>
        <Header name={s.storeName} theme={theme} />
        <main>{children}</main>
        <Footer s={s} />
      </CartProvider>
    </div>
  );
}
