'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RESOURCES } from '@/lib/adminConfig';

export default function ResourceList({ resource }: { resource: string }) {
  const cfg = RESOURCES[resource];
  const [items, setItems] = useState<any[] | null>(null);

  const load = () => fetch(`/api/admin/${resource}`).then((r) => r.json()).then(setItems);
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  async function remove(i: any) {
    if (!confirm(`Excluir "${cfg.title(i)}"?`)) return;
    await fetch(`/api/admin/${resource}/${i._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{cfg.label}</h1>
        <Link href={`/admin/${resource}/new`} className="btn-primary">+ Novo {cfg.singular}</Link>
      </div>

      {items === null ? (
        <p>Carregando…</p>
      ) : items.length === 0 ? (
        <p className="card p-10 text-center text-ink/60">Nada por aqui ainda. Crie o primeiro {cfg.singular}!</p>
      ) : (
        <div className="card divide-y divide-ink/10 overflow-hidden">
          {items.map((i) => (
            <div key={i._id} className="flex items-center gap-4 p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-pink-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cfg.thumb(i) ? <img src={cfg.thumb(i)} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center">🎈</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{cfg.title(i)}</div>
                <div className="truncate text-sm text-ink/60">{cfg.subtitle(i)}</div>
              </div>
              {cfg.status && (
                <span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline ${['Ativo', 'Publicado'].includes(cfg.status(i)) ? 'bg-aqua-soft text-aqua' : 'bg-sun-soft text-ink/70'}`}>
                  {cfg.status(i)}
                </span>
              )}
              <Link href={`/admin/${resource}/${i._id}`} className="btn-ghost btn-sm">Editar</Link>
              <button onClick={() => remove(i)} className="btn-sm rounded-full px-3 py-2 text-red-600 hover:bg-red-50" aria-label="Excluir">🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
