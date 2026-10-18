'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type CartItem = { id: string; slug: string; name: string; price: number; image?: string; qty: number };

type Ctx = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx>(null!);
const KEY = 'luana_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((cur) =>
      cur.some((i) => i.id === item.id)
        ? cur.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
        : [...cur, { ...item, qty }],
    );
  }, []);
  const setQty = useCallback(
    (id: string, qty: number) =>
      setItems((cur) => (qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i)))),
    [],
  );
  const remove = useCallback((id: string) => setItems((cur) => cur.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <CartCtx.Provider value={{ items, count, total, ready, add, setQty, remove, clear }}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
