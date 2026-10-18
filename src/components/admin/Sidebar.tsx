'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Painel', icon: '📊' },
  { href: '/admin/products', label: 'Produtos', icon: '🎈' },
  { href: '/admin/categories', label: 'Categorias', icon: '🏷️' },
  { href: '/admin/posts', label: 'Blog', icon: '📝' },
  { href: '/admin/appearance', label: 'Aparência', icon: '🎨' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="bg-ink text-white md:fixed md:inset-y-0 md:w-60">
      <div className="flex items-center justify-between p-4 md:block">
        <div className="font-display text-xl font-bold text-sun">🎈 Luana Balões</div>
        <div className="hidden text-xs text-white/50 md:block">Painel administrativo</div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:px-3">
        {items.map((i) => {
          const active = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 font-bold transition ${active ? 'bg-pink text-white' : 'text-white/80 hover:bg-white/10'}`}
            >
              {i.icon} {i.label}
            </Link>
          );
        })}
        <a href="/" target="_blank" className="whitespace-nowrap rounded-xl px-4 py-2.5 font-bold text-white/80 hover:bg-white/10 md:mt-6">🌐 Ver site</a>
        <button onClick={logout} className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left font-bold text-white/80 hover:bg-white/10">🚪 Sair</button>
      </nav>
    </aside>
  );
}
