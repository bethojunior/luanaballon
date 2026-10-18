'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import type { ThemeDef } from '@/lib/themes';

const links = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/blog', label: 'Blog' },
];

export default function Header({ name, theme: def }: { name: string; theme: ThemeDef }) {
  const { count } = useCart();
  const theme = def.base;

  if (theme === 'elegante') {
    return (
      <header className="sticky top-0 z-30 border-b border-sun/60 bg-cream/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center">
          <Link href="/" className="font-display text-3xl tracking-wide text-pink">{name}</Link>
          <nav className="mt-2 hidden items-center justify-center md:flex gap-5 text-xs font-bold uppercase tracking-[0.2em] md:gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="py-1 hover:text-pink">{l.label}</Link>
            ))}
            <Link href="/carrinho" className="py-1 hover:text-pink">Carrinho{count > 0 && ` (${count})`}</Link>
          </nav>
        </div>
      </header>
    );
  }

  if (theme === 'baby') {
    return (
      <header className="sticky top-0 z-30 px-3 pt-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between max-md:justify-center gap-3 rounded-full bg-white/95 px-5 py-2.5 shadow-[0_8px_24px_-12px_rgb(var(--grape))] backdrop-blur">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-pink">
            <span className="text-2xl">{def.emoji}</span>
            {name}
          </Link>
          <nav className="hidden items-center gap-1 md:flex md:gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-sm font-bold hover:bg-aqua-soft sm:text-base">{l.label}</Link>
            ))}
            <Link href="/carrinho" className="btn-primary btn-sm" aria-label="Carrinho">
              🧸{count > 0 && <span className="rounded-full bg-sun px-1.5 text-xs font-extrabold text-ink">{count}</span>}
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  if (theme === 'noite') {
    return (
      <header className="sticky top-0 z-30 border-b border-pink/60 bg-cream/90 shadow-[0_1px_24px_-6px_rgb(var(--pink))] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between max-md:justify-center gap-4 px-4 py-3.5">
          <Link href="/" className="font-display text-xl font-bold uppercase tracking-[0.2em] text-aqua [text-shadow:0_0_14px_rgb(var(--aqua))]">
            {name}
          </Link>
          <nav className="hidden items-center gap-3 text-sm font-bold uppercase tracking-wider md:flex md:gap-6">
            {links.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-pink hover:[text-shadow:0_0_12px_rgb(var(--pink))]">{l.label}</Link>
            ))}
            <Link href="/carrinho" className="rounded border border-pink px-3 py-1.5 text-pink hover:bg-pink hover:text-white">
              Carrinho ({count})
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  if (theme === 'minimo') {
    return (
      <header className="sticky top-0 z-30 border-b border-ink bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between max-md:justify-center gap-4 px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">{name.toLowerCase()}<span className="bg-sun px-1">.</span></Link>
          <nav className="hidden items-center gap-4 text-sm font-bold md:flex md:gap-6">
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
      <div className="mx-auto flex max-w-6xl items-center justify-between max-md:justify-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-pink">
          <span className="text-3xl">{def.emoji}</span>
          {name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex md:gap-3">
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
