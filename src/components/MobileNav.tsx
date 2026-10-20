'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

const tabs = [
  { href: '/', label: 'Início', icon: '🏠' },
  { href: '/produtos', label: 'Produtos', icon: '🎈' },
  { href: '/blog', label: 'Blog', icon: '📝' },
  { href: '/carrinho', label: 'Carrinho', icon: '🛒' },
];

/** Barra de navegação fixa no rodapé, só no celular. */
export default function MobileNav({ user }: { user?: { name: string } | null }) {
  const path = usePathname();
  const { count } = useCart();
  const all = [...tabs, user ? { href: '/conta', label: 'Conta', icon: '👤' } : { href: '/entrar', label: 'Entrar', icon: '👤' }];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-6px_20px_-12px_rgb(0_0_0/0.35)] backdrop-blur md:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {all.map((t) => {
          const active = t.href === '/' ? path === '/' : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${active ? 'text-pink' : 'text-ink/65'}`}
              >
                <span className="text-xl leading-none">{t.icon}</span>
                {t.label}
                {t.href === '/carrinho' && count > 0 && (
                  <span className="absolute right-[22%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] font-extrabold text-white">{count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
