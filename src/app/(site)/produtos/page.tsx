import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { safe } from '@/lib/data';
import { Category, Product } from '@/lib/models';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produtos' };

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default async function Produtos({ searchParams }: { searchParams: { categoria?: string; q?: string } }) {
  const categories = await safe(() => Category.find().sort({ order: 1, name: 1 }).lean() as Promise<any[]>, []);
  const current = categories.find((c) => c.slug === searchParams.categoria);

  const filter: Record<string, any> = { active: true };
  if (current) filter.category = current._id;
  if (searchParams.q) filter.name = { $regex: esc(searchParams.q), $options: 'i' };

  const products = await safe(
    () => Product.find(filter).sort({ createdAt: -1 }).populate('category', 'name slug').lean() as Promise<any[]>,
    [],
  );

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 font-bold transition ${active ? 'bg-pink text-white' : 'bg-white hover:bg-pink-soft'}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title text-pink">Nossos produtos</h1>

      <form className="mt-6 flex gap-2" action="/produtos">
        {current && <input type="hidden" name="categoria" value={current.slug} />}
        <input name="q" defaultValue={searchParams.q} placeholder="Buscar produto…" className="input max-w-md" />
        <button className="btn-primary">Buscar</button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/produtos" className={chip(!current)}>Todos</Link>
        {categories.map((c) => (
          <Link key={c._id} href={`/produtos?categoria=${c.slug}`} className={chip(current?._id === c._id)}>{c.name}</Link>
        ))}
      </div>

      {products.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      ) : (
        <p className="card mt-8 p-10 text-center text-ink/60">Nenhum produto encontrado 🎈</p>
      )}
    </div>
  );
}
