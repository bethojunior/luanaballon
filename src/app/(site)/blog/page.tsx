import { safe } from '@/lib/data';
import { Post } from '@/lib/models';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog' };

export default async function Blog() {
  const posts = await safe(() => Post.find({ where: { published: true }, order: [['publishedAt', 'DESC']] }), []);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title text-pink">Blog da Luana 🎉</h1>
      <p className="mt-2 text-ink/70">Ideias, tendências e dicas para festas inesquecíveis.</p>
      {posts.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <PostCard key={p._id} p={p} />)}
        </div>
      ) : (
        <p className="card mt-8 p-10 text-center text-ink/60">Ainda não temos posts. Volte em breve!</p>
      )}
    </div>
  );
}
