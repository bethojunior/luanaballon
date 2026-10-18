'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Painel', icon: '📊', tab: true },
  { href: '/admin/products', label: 'Produtos', icon: '🎈', tab: true },
  { href: '/admin/categories', label: 'Categorias', icon: '🏷️' },
  { href: '/admin/posts', label: 'Blog', icon: '📝', tab: true },
  { href: '/admin/appearance', label: 'Aparência', icon: '🎨', tab: true },
  { href: '/admin/seo', label: 'SEO e compartilhamento', icon: '🔎' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const isActive = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));
  const tabs = items.filter((i) => i.tab);
  const moreActive = items.some((i) => !i.tab && isActive(i.href));

  return (
    <>
      {/* desktop: menu lateral */}
      <aside className="hidden bg-ink text-white md:fixed md:inset-y-0 md:block md:w-60">
        <div className="p-4">
          <div className="font-display text-xl font-bold text-sun">🎈 Luana Balões</div>
          <div className="text-xs text-white/50">Painel administrativo</div>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-3">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 font-bold transition ${isActive(i.href) ? 'bg-pink text-white' : 'text-white/80 hover:bg-white/10'}`}
            >
              {i.icon} {i.label}
            </Link>
          ))}
          <a href="/" target="_blank" className="mt-6 rounded-xl px-4 py-2.5 font-bold text-white/80 hover:bg-white/10">🌐 Ver site</a>
          <button onClick={logout} className="rounded-xl px-4 py-2.5 text-left font-bold text-white/80 hover:bg-white/10">🚪 Sair</button>
        </nav>
      </aside>

      {/* celular: barra superior + abas no rodapé */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] text-white md:hidden">
        <div className="font-display text-lg font-bold text-sun">🎈 Luana Balões</div>
        <a href="/" target="_blank" className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold">🌐 Ver site</a>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-6px_20px_-12px_rgb(0_0_0/0.4)] md:hidden"
        aria-label="Menu do painel"
      >
        <ul className="grid grid-cols-5">
          {tabs.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${isActive(i.href) ? 'text-pink' : 'text-ink/65'}`}
              >
                <span className="text-xl leading-none">{i.icon}</span>
                {i.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => setOpen(true)}
              className={`flex min-h-[58px] w-full flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${moreActive ? 'text-pink' : 'text-ink/65'}`}
            >
              <span className="text-xl leading-none">☰</span>
              Mais
            </button>
          </li>
        </ul>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="rounded-t-3xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />
            <div className="grid gap-2">
              {items.filter((i) => !i.tab).map((i) => (
                <Link key={i.href} href={i.href} className={`rounded-2xl px-4 py-3.5 text-lg font-bold ${isActive(i.href) ? 'bg-pink text-white' : 'bg-ink/5'}`}>
                  {i.icon} {i.label}
                </Link>
              ))}
              <button onClick={logout} className="rounded-2xl bg-ink/5 px-4 py-3.5 text-left text-lg font-bold text-red-600">🚪 Sair</button>
              <button onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-center font-bold text-ink/60">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
