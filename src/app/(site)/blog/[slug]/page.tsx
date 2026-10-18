import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { safe } from '@/lib/data';
import { Post } from '@/lib/models';
import { dateBR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const load = (slug: string) => safe(() => Post.findOne({ slug, published: true }).lean() as Promise<any>, null);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await load(params.slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const p = await load(params.slug);
  if (!p) notFound();
  const html = await marked.parse(p.content || '');

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="font-bold text-pink hover:underline">← Voltar ao blog</Link>
      <div className="mt-6 text-sm font-bold uppercase text-grape">{dateBR(p.publishedAt)}</div>
      <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{p.title}</h1>
      {p.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.cover} alt={p.title} className="mt-8 w-full rounded-3xl" />
      )}
      <div className="prose-luana mt-8 text-lg" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
