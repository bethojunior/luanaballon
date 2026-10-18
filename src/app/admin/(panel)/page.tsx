import Link from 'next/link';
import { safe } from '@/lib/data';
import { Category, Post, Product } from '@/lib/models';

export default async function Dashboard() {
  const stats = await safe(
    async () => ({
      products: await Product.count(),
      active: await Product.count({ active: true }),
      categories: await Category.count(),
      posts: await Post.count(),
      published: await Post.count({ published: true }),
    }),
    null,
  );

  const cards = stats && [
    { label: 'Produtos', value: stats.products, sub: `${stats.active} visíveis`, href: '/admin/products', color: 'bg-pink-soft' },
    { label: 'Categorias', value: stats.categories, sub: 'temas da loja', href: '/admin/categories', color: 'bg-aqua-soft' },
    { label: 'Posts', value: stats.posts, sub: `${stats.published} publicados`, href: '/admin/posts', color: 'bg-sun-soft' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Olá, Luana! 👋</h1>
      <p className="mt-1 text-ink/60">Gerencie sua loja, seu blog e suas configurações.</p>

      {!cards ? (
        <p className="card mt-6 p-6 font-bold text-red-600">Não foi possível conectar ao banco de dados.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className={`card p-6 transition hover:-translate-y-1 ${c.color}`}>
              <div className="text-sm font-bold uppercase text-ink/60">{c.label}</div>
              <div className="font-display text-5xl font-bold">{c.value}</div>
              <div className="text-sm text-ink/60">{c.sub}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn-primary">+ Novo produto</Link>
        <Link href="/admin/posts/new" className="btn-sun">+ Novo post</Link>
        <Link href="/admin/categories/new" className="btn-ghost">+ Nova categoria</Link>
      </div>
    </div>
  );
}
