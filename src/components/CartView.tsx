'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { brl } from '@/lib/utils';

export default function CartView({ whatsapp, userName = '' }: { whatsapp: string; userName?: string }) {
  const { items, total, ready, setQty, remove, clear } = useCart();
  const [name, setName] = useState(userName);
  const [note, setNote] = useState('');

  if (!ready) return null;

  if (!items.length) {
    return (
      <div className="card p-10 text-center">
        <div className="text-6xl">🎈</div>
        <p className="mt-4 text-lg">Seu carrinho está vazio.</p>
        <Link href="/produtos" className="btn-primary mt-6">Ver produtos</Link>
      </div>
    );
  }

  const lines = items.map((i) => `• ${i.qty}x ${i.name} — ${brl(i.price * i.qty)}`).join('\n');
  const text =
    `Olá! Gostaria de fazer um pedido${name ? ` (${name})` : ''}:\n\n${lines}\n\nTotal: ${brl(total)}` +
    (note ? `\n\nObservações: ${note}` : '');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="card divide-y divide-ink/10">
        {items.map((i) => (
          <div key={i.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
            <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20 overflow-hidden rounded-2xl bg-pink-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {i.image ? <img src={i.image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-3xl">🎈</span>}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/produtos/${i.slug}`} className="font-display text-lg font-semibold hover:text-pink">{i.name}</Link>
              <div className="font-bold text-pink">{brl(i.price)}</div>
              <button onClick={() => remove(i.id)} className="text-sm text-ink/50 underline hover:text-pink">Remover</button>
            </div>
            <div className="ml-auto flex items-center rounded-full border-2 border-ink/10">
              <button className="h-11 w-11 text-lg" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Diminuir">−</button>
              <span className="w-7 text-center font-bold">{i.qty}</span>
              <button className="h-11 w-11 text-lg" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Aumentar">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card h-fit space-y-4 p-5 sm:p-6">
        <h2 className="text-2xl font-bold">Resumo</h2>
        <div className="flex justify-between text-xl font-extrabold">
          <span>Total</span>
          <span className="text-pink">{brl(total)}</span>
        </div>
        <div>
          <label className="label">Seu nome</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos te chamar?" />
        </div>
        <div>
          <label className="label">Observações</label>
          <textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Data da festa, cores, endereço de entrega…" />
        </div>
        <a
          className="btn-primary w-full"
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`}
        >
          💬 Finalizar pelo WhatsApp
        </a>
        <p className="text-center text-sm text-ink/60">Combinamos pagamento e entrega pelo WhatsApp.</p>
        <button onClick={clear} className="w-full text-sm text-ink/50 underline hover:text-pink">Esvaziar carrinho</button>
      </div>
    </div>
  );
}
