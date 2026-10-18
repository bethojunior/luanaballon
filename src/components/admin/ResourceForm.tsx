'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Field } from '@/lib/adminConfig';
import ImageUploader from './ImageUploader';
import ThemePicker from './ThemePicker';

type Props = {
  fields: Field[];
  saveUrl: string;
  method: 'POST' | 'PUT';
  loadUrl?: string;
  backHref?: string;
  defaults?: Record<string, any>;
};

export default function ResourceForm({ fields, saveUrl, method, loadUrl, backHref, defaults = {} }: Props) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, any>>(defaults);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!loadUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loadUrl) return;
    fetch(loadUrl)
      .then((r) => r.json())
      .then((d) => setData({ ...defaults, ...d, category: d.category?._id ?? d.category ?? '' }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadUrl]);

  useEffect(() => {
    if (fields.some((f) => f.type === 'category')) {
      fetch('/api/admin/categories').then((r) => r.json()).then(setCats);
    }
  }, [fields]);

  const set = (key: string, v: any) => {
    setSaved(false);
    setData((d) => ({ ...d, [key]: v }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch(saveUrl, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(json.error || 'Erro ao salvar');
    if (backHref) {
      router.push(backHref);
      router.refresh();
    } else setSaved(true);
  }

  if (loading) return <p>Carregando…</p>;

  return (
    <form onSubmit={submit} className="card grid gap-5 p-4 pb-0 sm:grid-cols-2 sm:p-6 sm:pb-0">
      {fields.map((f) => (
        <div key={f.key} className={f.half || f.type === 'boolean' ? '' : 'sm:col-span-2'}>
          {f.type !== 'boolean' && <label className="label">{f.label}{f.required && ' *'}</label>}

          {f.type === 'text' && (
            <input className="input" required={f.required} value={data[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
          )}
          {(f.type === 'textarea' || f.type === 'markdown') && (
            <textarea
              className={`input ${f.type === 'markdown' ? 'font-mono text-sm' : ''}`}
              rows={f.type === 'markdown' ? 16 : 4}
              value={data[f.key] ?? ''}
              onChange={(e) => set(f.key, e.target.value)}
            />
          )}
          {f.type === 'number' && (
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              required={f.required}
              value={data[f.key] ?? ''}
              onChange={(e) => set(f.key, e.target.value === '' ? null : Number(e.target.value))}
            />
          )}
          {f.type === 'boolean' && (
            <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border-2 border-ink/10 bg-white px-4 py-3 font-bold">
              <input type="checkbox" className="h-5 w-5 accent-pink" checked={!!data[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
              {f.label}
            </label>
          )}
          {f.type === 'category' && (
            <select className="input" value={data[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
              <option value="">Sem categoria</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
          {f.type === 'theme' && <ThemePicker value={data[f.key] || 'festa'} onChange={(v) => set(f.key, v)} />}
          {f.type === 'image' && <ImageUploader value={data[f.key] ? [data[f.key]] : []} onChange={(v) => set(f.key, v[0] ?? '')} />}
          {f.type === 'images' && <ImageUploader multiple value={data[f.key] ?? []} onChange={(v) => set(f.key, v)} />}

          {f.help && <p className="mt-1 text-xs text-ink/60">{f.help}</p>}
        </div>
      ))}

      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-ink/10 bg-white px-4 py-3 sm:static sm:col-span-2 sm:mx-0 sm:border-0 sm:px-0 md:bottom-0 md:sticky">
        <button className="btn-primary flex-1 sm:flex-none" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
        {backHref && <Link href={backHref} className="btn-ghost flex-1 sm:flex-none">Cancelar</Link>}
        {saved && <span className="font-bold text-aqua">✓ Salvo!</span>}
        {error && <span className="font-bold text-red-600">{error}</span>}
      </div>
    </form>
  );
}
