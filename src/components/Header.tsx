'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import type { ThemeId } from '@/lib/themes';

const links = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/blog', label: 'Blog' },
];

export default function Header({ name, theme }: { name: string; theme: ThemeId }) {
  const { count } = useCart();

  if (theme === 'elegante') {
    return (
      <header className="sticky top-0 z-30 border-b border-sun/60 bg-cream/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center">
          <Link href="/" className="font-display text-3xl tracking-wide text-pink">{name}</Link>
          <nav className="mt-2 flex items-center justify-center gap-5 text-xs font-bold uppercase tracking-[0.2em] sm:gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="py-1 hover:text-pink">{l.label}</Link>
            ))}
            <Link href="/carrinho" className="py-1 hover:text-pink">Carrinho{count > 0 && ` (${count})`}</Link>
          </nav>
        </div>
      </header>
    );
  }

  if (theme === 'minimo') {
    return (
      <header className="sticky top-0 z-30 border-b border-ink bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">{name.toLowerCase()}<span className="bg-sun px-1">.</span></Link>
          <nav className="flex items-center gap-4 text-sm font-bold sm:gap-6">
            {links.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline">{l.label}</Link>
            ))}
            <Link href="/carrinho" className="border border-ink px-3 py-1.5 hover:bg-ink hover:text-white">
              Carrinho ({count})
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b-4 border-sun bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-pink">
          <span className="text-3xl">🎈</span>
          {name}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm font-bold hover:bg-pink-soft hover:text-pink sm:text-base">
              {l.label}
            </Link>
          ))}
          <Link href="/carrinho" className="btn-primary btn-sm relative" aria-label="Carrinho">
            🛒
            {count > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-sun px-1 text-xs font-extrabold text-ink">{count}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
