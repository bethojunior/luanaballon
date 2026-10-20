import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FX from '@/components/FX';
import MobileNav from '@/components/MobileNav';
import { CartProvider } from '@/components/CartProvider';
import { getSettings } from '@/lib/data';
import { getUser } from '@/lib/userAuth';
import { activeTheme } from '@/lib/activeTheme';
import { themeStyle } from '@/lib/themes';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const theme = activeTheme(s.layout);
  const user = await getUser();
  return (
    <div data-theme={theme.id} data-base={theme.base} data-dark={theme.dark ? '' : undefined} style={themeStyle(theme)}>
      <FX theme={theme} level={s.fxLevel} style={s.fxStyle} />
      <CartProvider>
        <Header name={s.storeName} theme={theme} user={user && { name: user.name }} />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer s={s} theme={theme} />
        <MobileNav user={user && { name: user.name }} />
      </CartProvider>
    </div>
  );
}
