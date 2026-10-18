import Link from 'next/link';
import { brl } from '@/lib/utils';
import { AddToCartButton } from './AddToCart';

export default function ProductCard({ p }: { p: any }) {
  const image = p.images?.[0];
  const off = p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;
  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1">
      <Link href={`/produtos/${p.slug}`} className="relative block aspect-square overflow-hidden bg-pink-soft">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <span className="grid h-full place-items-center text-6xl">🎈</span>
        )}
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-sun px-3 py-1 text-sm font-bold">-{off}%</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {p.category?.name && <span className="text-xs font-bold uppercase tracking-wide text-grape">{p.category.name}</span>}
        <Link href={`/produtos/${p.slug}`} className="font-display text-lg font-semibold leading-snug hover:text-pink">
          {p.name}
        </Link>
        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {p.comparePrice > p.price && <div className="text-sm text-ink/50 line-through">{brl(p.comparePrice)}</div>}
            <div className="text-xl font-extrabold text-pink">{brl(p.price)}</div>
          </div>
          <AddToCartButton small product={{ id: p._id, slug: p.slug, name: p.name, price: p.price, image }} />
        </div>
      </div>
    </div>
  );
}
