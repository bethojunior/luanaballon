import Link from 'next/link';
import { dateBR } from '@/lib/utils';

export default function PostCard({ p }: { p: any }) {
  return (
    <Link href={`/blog/${p.slug}`} className="card group overflow-hidden transition hover:-translate-y-1">
      <div className="aspect-[16/10] overflow-hidden bg-aqua-soft">
        {p.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <span className="grid h-full place-items-center text-5xl">🎉</span>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs font-bold uppercase text-grape">{dateBR(p.publishedAt)}</div>
        <h3 className="mt-1 text-xl font-semibold leading-snug group-hover:text-pink">{p.title}</h3>
        {p.excerpt && <p className="mt-2 line-clamp-3 text-ink/70">{p.excerpt}</p>}
      </div>
    </Link>
  );
}
