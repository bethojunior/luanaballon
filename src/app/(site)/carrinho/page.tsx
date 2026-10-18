import CartView from '@/components/CartView';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Carrinho' };

export default async function Carrinho() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title mb-8 text-pink">Seu carrinho 🛒</h1>
      <CartView whatsapp={s.whatsapp} />
    </div>
  );
}
