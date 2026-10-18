import Link from 'next/link';
import type { SiteSettings } from '@/lib/data';

export default function Footer({ s }: { s: SiteSettings }) {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="h-3 bg-[repeating-linear-gradient(90deg,rgb(var(--pink))_0_40px,rgb(var(--sun))_40px_80px,rgb(var(--aqua))_80px_120px,rgb(var(--grape))_120px_160px)]" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl font-bold">🎈 {s.storeName}</div>
          <p className="mt-3 text-white/70">{s.aboutText}</p>
        </div>
        <div>
          <h4 className="mb-3 text-lg font-bold text-sun">Navegue</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/produtos" className="hover:text-sun">Produtos</Link></li>
            <li><Link href="/blog" className="hover:text-sun">Blog</Link></li>
            <li><Link href="/carrinho" className="hover:text-sun">Carrinho</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-lg font-bold text-sun">Fale com a gente</h4>
          <ul className="space-y-2 text-white/80">
            <li><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-sun">💬 WhatsApp</a></li>
            {s.instagram && <li><a href={s.instagram} target="_blank" rel="noreferrer" className="hover:text-sun">📸 Instagram</a></li>}
            {s.email && <li>✉️ {s.email}</li>}
            {s.address && <li>📍 {s.address}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {s.storeName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
