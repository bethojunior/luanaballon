'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountView() {
  const router = useRouter();
  const [d, setD] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/user/me').then((r) => (r.ok ? r.json() : null)).then((u) => (u ? setD(u) : router.replace('/entrar')));
  }, [router]);

  if (!d) return <p className="text-center">Carregando…</p>;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/user/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    setBusy(false);
    setMsg(res.ok ? '✓ Dados salvos!' : (await res.json().catch(() => ({}))).error || 'Erro ao salvar');
    if (res.ok) router.refresh();
  }

  async function logout() {
    await fetch('/api/user/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <form onSubmit={save} className="card space-y-4 p-5 sm:p-7">
        <h1 className="text-2xl font-bold text-pink">Olá, {d.name.split(' ')[0]}! 👋</h1>
        <div>
          <label className="label" htmlFor="c-name">Nome</label>
          <input id="c-name" className="input" required value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="c-email">E-mail</label>
          <input id="c-email" className="input opacity-60" value={d.email} disabled />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">WhatsApp</label>
          <input id="c-phone" className="input" type="tel" inputMode="tel" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} />
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
        {msg && <p className="text-center text-sm font-bold text-aqua">{msg}</p>}
      </form>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/produtos" className="btn-sun">🎈 Ver produtos</Link>
        <button onClick={logout} className="btn-ghost">🚪 Sair</button>
      </div>
    </div>
  );
}
