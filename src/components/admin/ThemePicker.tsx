'use client';

import { useState } from 'react';
import { THEME_GROUPS, themeFlag, type ThemeDef } from '@/lib/themes';

/** Miniaturas que mostram a estrutura e a paleta de cada layout. */
function Preview({ t }: { t: ThemeDef }) {
  const [a, b, c, d] = t.swatches;
  const line = t.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const box = { background: t.cream, border: `1px solid ${line}` };

  if (t.base === 'elegante') {
    return (
      <div className="h-36 overflow-hidden" style={box}>
        <div className="py-2 text-center" style={{ borderBottom: `1px solid ${b}` }}>
          <div className="font-serif text-[11px] tracking-wide" style={{ color: a }}>Luana Balões</div>
          <div className="mt-0.5 text-[6px] tracking-[0.2em]" style={{ color: t.ink }}>INÍCIO · PRODUTOS · BLOG</div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <div>
            <div className="h-1.5 w-12" style={{ background: b }} />
            <div className="mt-2 h-2 w-full" style={{ background: t.ink }} />
            <div className="mt-1 h-2 w-3/4" style={{ background: t.ink }} />
            <div className="mt-3 h-4 w-14" style={{ background: a }} />
          </div>
          <div className="flex items-end gap-1">
            {[18, 26, 14].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-full" style={{ height: h * 2, background: [a, b, c][i], opacity: 0.55 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (t.base === 'minimo') {
    return (
      <div className="h-36 overflow-hidden" style={box}>
        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${t.ink}` }}>
          <div className="text-[9px] font-bold" style={{ color: t.ink }}>luana<span style={{ background: b }}>.</span></div>
          <div className="px-1 text-[6px]" style={{ border: `1px solid ${t.ink}`, color: t.ink }}>Carrinho (0)</div>
        </div>
        <div className="p-3">
          <div className="inline-block px-1 text-[6px] font-bold text-black" style={{ background: b }}>{t.group.toUpperCase().slice(0, 18)}</div>
          <div className="mt-2 h-3 w-full" style={{ background: t.ink }} />
          <div className="mt-1 h-3 w-4/5" style={{ background: t.ink }} />
          <div className="mt-3 flex gap-1">
            <div className="h-4 w-12" style={{ background: a }} />
            <div className="h-4 w-12" style={{ background: b }} />
          </div>
        </div>
        <div className="mt-1 h-3" style={{ background: t.dark ? c : t.ink }} />
      </div>
    );
  }

  if (t.base === 'baby') {
    return (
      <div className="relative h-36 overflow-hidden" style={box}>
        <div className="mx-2 mt-2 flex items-center justify-between rounded-full px-3 py-1.5 shadow" style={{ background: '#fff' }}>
          <div className="text-[10px] font-bold" style={{ color: a }}>{t.emoji} Luana Balões</div>
          <div className="h-3 w-5 rounded-full" style={{ background: a }} />
        </div>
        <div className="px-6 pt-4 text-center">
          <div className="mx-auto h-2 w-16 rounded-full" style={{ background: c, opacity: 0.5 }} />
          <div className="mx-auto mt-2 h-2.5 w-4/5 rounded-full" style={{ background: a }} />
          <div className="mx-auto mt-1 h-2.5 w-3/5 rounded-full" style={{ background: a }} />
          <div className="mt-3 flex justify-center gap-1">
            <div className="h-4 w-12 rounded-full" style={{ background: a }} />
            <div className="h-4 w-12 rounded-full" style={{ background: b }} />
          </div>
        </div>
        {[c, d, b].map((col, i) => (
          <div key={i} className="absolute h-6 w-4 rounded-full opacity-80" style={{ background: col, left: [10, undefined, undefined][i], right: [undefined, 12, 40][i], top: [46, 40, 96][i] }} />
        ))}
      </div>
    );
  }

  if (t.base === 'noite') {
    return (
      <div className="h-36 overflow-hidden" style={box}>
        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${a}`, boxShadow: `0 1px 10px ${a}66` }}>
          <div className="text-[8px] font-bold tracking-[0.2em]" style={{ color: c }}>LUANA BALÕES</div>
          <div className="px-1 text-[6px]" style={{ border: `1px solid ${a}`, color: a }}>CARRINHO</div>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr] gap-2 p-3">
          <div>
            <div className="h-1 w-10" style={{ background: c }} />
            <div className="mt-2 h-2.5 w-full" style={{ background: t.ink }} />
            <div className="mt-1 h-2.5 w-2/3" style={{ background: t.ink }} />
            <div className="mt-3 h-4 w-14 rounded-sm" style={{ background: a, boxShadow: `0 0 10px ${a}` }} />
          </div>
          <div className="relative">
            {[a, c, b].map((col, i) => (
              <div key={i} className="absolute h-8 w-5 rounded-full" style={{ background: col, boxShadow: `0 0 12px ${col}`, left: [4, 28, 16][i], top: [0, 6, 40][i] }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-36 overflow-hidden" style={box}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: t.dark ? '#222' : '#fff', borderBottom: `3px solid ${b}` }}>
        <div className="text-[10px] font-bold" style={{ color: a }}>{t.emoji} Luana Balões</div>
        <div className="h-3 w-5 rounded-full" style={{ background: a }} />
      </div>
      <div className="px-6 pt-4 text-center">
        <div className="mx-auto h-1.5 w-14 rounded-full" style={{ background: b }} />
        <div className="mx-auto mt-2 h-2.5 w-4/5 rounded-full" style={{ background: a }} />
        <div className="mx-auto mt-1 h-2.5 w-3/5 rounded-full" style={{ background: a }} />
        <div className="mt-3 flex justify-center gap-1">
          <div className="h-4 w-12 rounded-full" style={{ background: a }} />
          <div className="h-4 w-12 rounded-full" style={{ background: b }} />
        </div>
      </div>
      {[a, c, d].map((col, i) => (
        <div key={i} className="absolute h-6 w-4 rounded-full" style={{ background: col, left: [8, 'auto', 'auto'][i] as any, right: [undefined, 10, 36][i], top: [44, 38, 90][i] }} />
      ))}
    </div>
  );
}

export default function ThemePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const groups = THEME_GROUPS.filter((g) => !term || g.group.toLowerCase().includes(term) || g.items.some((t) => t.id.includes(term)));

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar evento (ex.: natal, casamento, halloween)"
        className="input mb-6 max-w-md"
      />
      {groups.length === 0 && <p className="text-ink/60">Nenhum evento encontrado.</p>}
      {groups.map((g) => (
        <section key={g.group} className="mb-8">
          <h3 className="mb-3 text-xl font-bold">{g.group}</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {g.items.map((t) => {
              const active = value === t.id;
              const n = themeFlag(t.id);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => onChange(t.id)}
                  className={`rounded-2xl border-4 bg-white p-3 text-left transition ${active ? 'border-pink shadow-lg' : 'border-transparent hover:border-ink/20'}`}
                >
                  <Preview t={t} />
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold">{t.name}</span>
                    <span className="shrink-0 rounded-full bg-ink/10 px-2 py-0.5 font-mono text-xs">?l={n}</span>
                    {active && <span className="rounded-full bg-pink px-2 py-0.5 text-xs font-bold text-white">Ativo</span>}
                  </div>
                  <div className="mt-1 flex gap-1">
                    {t.swatches.map((s) => <span key={s} className="h-4 w-4 rounded-full border border-black/10" style={{ background: s }} />)}
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{t.description}</p>
                  <a
                    href={`/?l=${n}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-block text-sm font-bold text-pink underline"
                  >
                    Pré-visualizar ↗ <span className="font-mono text-xs font-normal text-ink/50">(?l={t.id})</span>
                  </a>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
