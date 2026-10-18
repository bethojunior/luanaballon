'use client';

import { useRef, useState } from 'react';

type Props = { value: string[]; onChange: (v: string[]) => void; multiple?: boolean };

export default function ImageUploader({ value, onChange, multiple }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Falha no upload');
        break;
      }
      urls.push(json.url);
    }
    onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
    setBusy(false);
    if (input.current) input.current.value = '';
  }

  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url} className="group relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-ink/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 px-1 py-0.5 text-white opacity-0 transition group-hover:opacity-100">
              {multiple && <button type="button" onClick={() => move(i, -1)} aria-label="Mover para trás">←</button>}
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remover">🗑</button>
              {multiple && <button type="button" onClick={() => move(i, 1)} aria-label="Mover para frente">→</button>}
            </div>
            {i === 0 && multiple && <span className="absolute left-1 top-1 rounded bg-sun px-1.5 text-xs font-bold text-ink">capa</span>}
          </div>
        ))}
        {(multiple || value.length === 0) && (
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="grid h-28 w-28 place-items-center rounded-2xl border-2 border-dashed border-grape/50 bg-grape-soft text-sm font-bold text-grape hover:border-grape"
          >
            {busy ? 'Enviando…' : '+ Imagem'}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => upload(e.target.files)} />
      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
}
