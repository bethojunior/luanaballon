import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import { CartProvider } from '@/components/CartProvider';
import { getSettings } from '@/lib/data';
import { activeTheme } from '@/lib/activeTheme';
import { themeStyle } from '@/lib/themes';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const theme = activeTheme(s.layout);
  return (
    <div data-theme={theme.id} data-base={theme.base} data-dark={theme.dark ? '' : undefined} style={themeStyle(theme)}>
      <CartProvider>
        <Header name={s.storeName} theme={theme} />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer s={s} theme={theme} />
        <MobileNav />
      </CartProvider>
    </div>
  );
}
