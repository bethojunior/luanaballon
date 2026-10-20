'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from './PasswordInput';

type Mode = 'login' | 'register' | 'admin';

const TITLES: Record<Mode, string> = { login: 'Entrar', register: 'Criar conta', admin: 'Acesso administrativo' };

/** Login e cadastro de clientes; "Sou admin" troca para o acesso ao painel. */
export default function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((v) => ({ ...v, [k]: e.target.value }));
  const go = (m: Mode) => {
    setMode(m);
    setError('');
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'register' && f.password !== f.confirm) return setError('As senhas não conferem.');
    setBusy(true);
    const url = mode === 'admin' ? '/api/auth/login' : mode === 'login' ? '/api/user/login' : '/api/user/register';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mode === 'register' ? f : { email: f.email, password: f.password }),
    });
    if (res.ok) {
      router.push(mode === 'admin' ? '/admin' : '/conta');
      router.refresh();
      return;
    }
    setError((await res.json().catch(() => ({}))).error || 'Não foi possível continuar.');
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {mode !== 'admin' && (
        <div className="mb-4 grid grid-cols-2 rounded-full bg-ink/10 p-1 font-bold" role="tablist">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => go(m)}
              className={`min-h-[44px] rounded-full px-4 transition ${mode === m ? 'bg-pink text-white shadow' : 'text-ink/70'}`}
            >
              {TITLES[m]}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="card space-y-4 p-5 sm:p-7">
        <div className="text-center">
          <div className="text-4xl">{mode === 'admin' ? '🔐' : '🎈'}</div>
          <h1 className="mt-1 text-2xl font-bold text-pink">{TITLES[mode]}</h1>
          {mode === 'admin' && <p className="text-sm text-ink/60">Use o e-mail e a senha do painel da loja.</p>}
          {mode === 'register' && <p className="text-sm text-ink/60">Crie sua conta para acompanhar seus pedidos.</p>}
        </div>

        {mode === 'register' && (
          <div>
            <label className="label" htmlFor="a-name">Nome</label>
            <input id="a-name" className="input" required autoComplete="name" value={f.name} onChange={set('name')} />
          </div>
        )}
        <div>
          <label className="label" htmlFor="a-email">E-mail</label>
          <input id="a-email" className="input" type="email" required autoComplete="email" inputMode="email" value={f.email} onChange={set('email')} />
        </div>
        {mode === 'register' && (
          <div>
            <label className="label" htmlFor="a-phone">WhatsApp (opcional)</label>
            <input id="a-phone" className="input" type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" value={f.phone} onChange={set('phone')} />
          </div>
        )}
        <div>
          <label className="label" htmlFor="a-pass">Senha</label>
          <PasswordInput id="a-pass" required minLength={mode === 'register' ? 6 : undefined} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={f.password} onChange={set('password')} />
        </div>
        {mode === 'register' && (
          <div>
            <label className="label" htmlFor="a-confirm">Confirmar senha</label>
            <PasswordInput id="a-confirm" required autoComplete="new-password" value={f.confirm} onChange={set('confirm')} />
            <p className="mt-1 text-xs text-ink/60">Mínimo de 6 caracteres.</p>
          </div>
        )}

        {error && <p role="alert" className="text-sm font-bold text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? 'Aguarde…' : mode === 'register' ? 'Criar minha conta' : 'Entrar'}
        </button>
      </form>

      <div className="mt-4 text-center">
        {mode === 'admin' ? (
          <button type="button" onClick={() => go('login')} className="min-h-[44px] font-bold text-ink/70 underline">← Voltar para o login de cliente</button>
        ) : (
          <button type="button" onClick={() => go('admin')} className="btn-ghost btn-sm">🔐 Sou admin</button>
        )}
      </div>
    </div>
  );
}
