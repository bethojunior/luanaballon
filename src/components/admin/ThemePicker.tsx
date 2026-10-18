'use client';

import { THEMES } from '@/lib/themes';

/** Miniaturas que mostram a estrutura de cada layout. */
function Preview({ id }: { id: string }) {
  const t = THEMES.find((x) => x.id === id)!;
  const [a, b, c, d] = t.swatches;

  if (id === 'elegante') {
    return (
      <div className="h-36 overflow-hidden border border-black/10" style={{ background: '#FCF8F3' }}>
        <div className="py-2 text-center" style={{ borderBottom: `1px solid ${b}` }}>
          <div className="font-serif text-[11px] tracking-wide" style={{ color: a }}>Luana Balões</div>
          <div className="mt-0.5 text-[6px] tracking-[0.2em]">INÍCIO · PRODUTOS · BLOG</div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <div>
            <div className="h-1.5 w-12" style={{ background: b }} />
            <div className="mt-2 h-2 w-full bg-black/60" />
            <div className="mt-1 h-2 w-3/4 bg-black/60" />
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

  if (id === 'minimo') {
    return (
      <div className="h-36 overflow-hidden border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black px-3 py-2">
          <div className="text-[9px] font-bold">luana<span style={{ background: b }}>.</span></div>
          <div className="border border-black px-1 text-[6px]">Carrinho (0)</div>
        </div>
        <div className="p-3">
          <div className="inline-block px-1 text-[6px] font-bold" style={{ background: b }}>LOJA DE FESTAS</div>
          <div className="mt-2 h-3 w-full bg-black" />
          <div className="mt-1 h-3 w-4/5 bg-black" />
          <div className="mt-3 flex gap-1">
            <div className="h-4 w-12 bg-black" />
            <div className="h-4 w-12" style={{ background: b }} />
          </div>
        </div>
        <div className="mt-1 h-3 bg-black" />
      </div>
    );
  }

  return (
    <div className="relative h-36 overflow-hidden border border-black/10" style={{ background: '#FFF7E6' }}>
      <div className="flex items-center justify-between bg-white px-3 py-2" style={{ borderBottom: `3px solid ${b}` }}>
        <div className="text-[10px] font-bold" style={{ color: a }}>🎈 Luana Balões</div>
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
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {THEMES.map((t) => {
        const active = value === t.id;
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-2xl border-4 bg-white p-3 text-left transition ${active ? 'border-pink shadow-lg' : 'border-transparent hover:border-ink/20'}`}
          >
            <Preview id={t.id} />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-lg font-bold">{t.name}</span>
              {active && <span className="rounded-full bg-pink px-2 py-0.5 text-xs font-bold text-white">Ativo</span>}
            </div>
            <div className="mt-1 flex gap-1">
              {t.swatches.map((s) => <span key={s} className="h-4 w-4 rounded-full border border-black/10" style={{ background: s }} />)}
            </div>
            <p className="mt-2 text-sm text-ink/70">{t.description}</p>
          </button>
        );
      })}
    </div>
  );
}
