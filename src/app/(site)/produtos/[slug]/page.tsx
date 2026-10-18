import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Gallery from '@/components/Gallery';
import { BuyBox } from '@/components/AddToCart';
import ProductCard from '@/components/ProductCard';
import { getSettings, safe } from '@/lib/data';
import { Product } from '@/lib/models';
import { brl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const load = (slug: string) =>
  safe(() => Product.findOne({ slug, active: true }).populate('category', 'name slug').lean() as Promise<any>, null);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await load(params.slug);
  return p ? { title: p.name, description: p.description?.slice(0, 160) } : {};
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const p = await load(params.slug);
  if (!p) notFound();
  const s = await getSettings();
  const related = p.category
    ? await safe(
        () =>
          Product.find({ active: true, category: p.category._id, _id: { $ne: p._id } })
            .limit(4)
            .populate('category', 'name slug')
            .lean() as Promise<any[]>,
        [],
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/produtos" className="hover:text-pink">Produtos</Link>
        {p.category && (
          <>
            {' / '}
            <Link href={`/produtos?categoria=${p.category.slug}`} className="hover:text-pink">{p.category.name}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <Gallery images={p.images ?? []} alt={p.name} />
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{p.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-pink">{brl(p.price)}</span>
            {p.comparePrice > p.price && <span className="text-lg text-ink/50 line-through">{brl(p.comparePrice)}</span>}
          </div>
          {p.description && <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink/80">{p.description}</p>}
          <div className="mt-8 border-t-2 border-dashed border-ink/10 pt-8">
            <BuyBox
              whatsapp={s.whatsapp}
              product={{ id: p._id, slug: p.slug, name: p.name, price: p.price, image: p.images?.[0] }}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title">Você também vai gostar</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => <ProductCard key={r._id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
