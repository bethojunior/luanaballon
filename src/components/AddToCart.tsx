'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

type P = { id: string; slug: string; name: string; price: number; image?: string };

export function AddToCartButton({ product, small }: { product: P; small?: boolean }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      className={`btn-primary ${small ? 'btn-sm' : ''}`}
      onClick={() => {
        add(product);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
    >
      {done ? '✓ Adicionado!' : '🛒 Adicionar'}
    </button>
  );
}

export function BuyBox({ product, whatsapp }: { product: P; whatsapp: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const msg = encodeURIComponent(`Olá! Quero comprar ${qty}x ${product.name}.`);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-bold">Quantidade</span>
        <div className="flex items-center rounded-full border-2 border-ink/10 bg-white">
          <button className="h-10 w-10 text-xl" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir">−</button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button className="h-10 w-10 text-xl" onClick={() => setQty(qty + 1)} aria-label="Aumentar">+</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn-primary"
          onClick={() => {
            add(product, qty);
            setDone(true);
          }}
        >
          🛒 Adicionar ao carrinho
        </button>
        <a className="btn-sun" href={`https://wa.me/${whatsapp}?text=${msg}`} target="_blank" rel="noreferrer">
          💬 Comprar pelo WhatsApp
        </a>
      </div>
      {done && (
        <p className="font-bold text-aqua">
          Adicionado! <Link href="/carrinho" className="underline">Ver carrinho</Link>
        </p>
      )}
    </div>
  );
}
