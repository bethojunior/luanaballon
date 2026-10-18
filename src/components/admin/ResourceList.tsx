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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{cfg.label}</h1>
        <Link href={`/admin/${resource}/new`} className="btn-primary">+ Novo {cfg.singular}</Link>
      </div>

      {items === null ? (
        <p>Carregando…</p>
      ) : items.length === 0 ? (
        <p className="card p-10 text-center text-ink/60">Nada por aqui ainda. Crie o primeiro {cfg.singular}!</p>
      ) : (
        <div className="card divide-y divide-ink/10 overflow-hidden">
          {items.map((i) => (
            <div key={i._id} className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3 sm:flex-nowrap sm:gap-4 sm:p-4">
              <div className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 overflow-hidden rounded-xl bg-pink-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cfg.thumb(i) ? <img src={cfg.thumb(i)} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center">🎈</span>}
              </div>
              <div className="min-w-0 flex-1 basis-[calc(100%-4rem)] sm:basis-0">
                <div className="truncate font-bold">{cfg.title(i)}</div>
                <div className="truncate text-sm text-ink/60">{cfg.subtitle(i)}</div>
              </div>
              {cfg.status && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${['Ativo', 'Publicado'].includes(cfg.status(i)) ? 'bg-aqua-soft text-aqua' : 'bg-sun-soft text-ink/70'}`}>
                  {cfg.status(i)}
                </span>
              )}
              <Link href={`/admin/${resource}/${i._id}`} className="btn-ghost btn-sm ml-auto">Editar</Link>
              <button onClick={() => remove(i)} className="grid h-11 w-11 place-items-center rounded-full text-red-600 hover:bg-red-50" aria-label="Excluir">🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
