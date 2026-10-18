import Link from 'next/link';
import Balloon from '@/components/Balloon';
import Hero from '@/components/Heroes';
import { activeTheme } from '@/lib/activeTheme';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import { getSettings, safe } from '@/lib/data';
import { Category, Post, Product, withCategory } from '@/lib/models';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [s, categories, featured, posts] = await Promise.all([
    getSettings(),
    safe(() => Category.find({ order: [['order', 'ASC'], ['name', 'ASC']] }), []),
    safe(
      async () => withCategory(await Product.find({ where: { active: true, featured: true }, order: [['createdAt', 'DESC']], limit: 8 })),
      [],
    ),
    safe(() => Post.find({ where: { published: true }, order: [['publishedAt', 'DESC']], limit: 3 }), []),
  ]);

  const theme = activeTheme(s.layout);
  const colors = ['pink', 'sun', 'aqua', 'grape'];

  return (
    <>
      <Hero theme={theme} s={s} featured={featured} />

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <h2 className="section-title text-center">Escolha pelo tema</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c, i) => (
              <Link
                key={c._id}
                href={`/produtos?categoria=${c.slug}`}
                className="card group overflow-hidden text-center transition hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden" style={{ background: `rgb(var(--${colors[i % 4]}) / 0.2)` }}>
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="grid h-full place-items-center text-5xl">🎈</span>
                  )}
                </div>
                <div className="p-3 font-display text-lg font-semibold">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="flex items-end justify-between">
          <h2 className="section-title">Os queridinhos ✨</h2>
          <Link href="/produtos" className="font-bold text-pink hover:underline">Ver todos →</Link>
        </div>
        {featured.length ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => <ProductCard key={p._id} p={p} />)}
          </div>
        ) : (
          <p className="card mt-8 p-8 text-center text-ink/60">Em breve novidades por aqui! Marque produtos como “destaque” no painel.</p>
        )}
      </section>

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="flex items-end justify-between">
            <h2 className="section-title">Dicas para sua festa</h2>
            <Link href="/blog" className="font-bold text-pink hover:underline">Ir para o blog →</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {posts.map((p) => <PostCard key={p._id} p={p} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-grape p-10 text-center text-white sm:p-14">
          <Balloon color="sun" className="absolute -left-2 top-4 w-14 opacity-90" />
          <Balloon color="pink" className="absolute -right-2 bottom-2 w-16 opacity-90" delay={1.5} />
          <h2 className="text-3xl font-bold sm:text-4xl">Quer algo sob medida?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">Arcos de balões, painéis e kits personalizados. Conte pra gente sobre sua festa!</p>
          <a href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent('Olá! Quero um orçamento para minha festa 🎈')}`} target="_blank" rel="noreferrer" className="btn-sun mt-6">
            Pedir orçamento
          </a>
        </div>
      </section>
    </>
  );
}
