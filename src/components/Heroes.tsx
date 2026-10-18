import Link from 'next/link';
import Balloon from './Balloon';
import type { SiteSettings } from '@/lib/data';
import type { ThemeId } from '@/lib/themes';

type P = { s: SiteSettings; featured: any[] };

const wa = (s: SiteSettings) => `https://wa.me/${s.whatsapp}`;

function Buttons({ s }: { s: SiteSettings }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/produtos" className="btn-primary">Ver produtos</Link>
      <a href={wa(s)} target="_blank" rel="noreferrer" className="btn-sun">💬 Falar no WhatsApp</a>
    </div>
  );
}

function HeroFesta({ s }: P) {
  return (
    <section className="confetti relative overflow-hidden">
      <Balloon color="pink" className="absolute left-[4%] top-10 w-16 sm:w-24" />
      <Balloon color="aqua" className="absolute right-[6%] top-6 w-14 sm:w-20" delay={1} />
      <Balloon color="sun" className="absolute bottom-6 left-[14%] hidden w-16 sm:block" delay={2} />
      <Balloon color="grape" className="absolute bottom-10 right-[14%] hidden w-20 sm:block" delay={0.5} />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <span className="inline-block rounded-full bg-sun px-4 py-1 text-sm font-extrabold">🎉 Festa pronta, é só pedir!</span>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-pink sm:text-6xl">{s.heroTitle}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">{s.heroSubtitle}</p>
        <div className="flex justify-center"><Buttons s={s} /></div>
      </div>
    </section>
  );
}

function HeroElegante({ s, featured }: P) {
  const heights = ['h-64', 'h-80', 'h-56'];
  const tones = ['pink', 'sun', 'aqua'];
  return (
    <section className="confetti">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-sun">Balões &amp; Decoração</p>
          <h1 className="mt-5 text-4xl leading-tight sm:text-6xl">{s.heroTitle}</h1>
          <div className="my-6 h-px w-24 bg-sun" />
          <p className="max-w-md text-lg text-ink/75">{s.heroSubtitle}</p>
          <Buttons s={s} />
        </div>
        <div className="grid grid-cols-3 items-end gap-3">
          {[0, 1, 2].map((i) => {
            const img = featured[i]?.images?.[0];
            return (
              <div
                key={i}
                className={`${heights[i]} relative overflow-hidden rounded-t-full border border-sun/50 bg-pink-soft ${i === 1 ? '-translate-y-6' : ''}`}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Balloon color={tones[i]} className="mx-auto mt-8 w-14" delay={i} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroMinimo({ s }: P) {
  const words = ['Balões', 'Arcos', 'Painéis', 'Kits de festa', 'Decoração', 'Personalizados'];
  return (
    <section className="border-b border-ink">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <p className="inline-block bg-sun px-3 py-1 text-sm font-bold uppercase tracking-wide">Loja de festas</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] md:text-8xl">{s.heroTitle}</h1>
        <p className="mt-6 max-w-xl text-xl text-ink/70">{s.heroSubtitle}</p>
        <Buttons s={s} />
      </div>
      <div className="overflow-hidden whitespace-nowrap bg-ink py-3 text-sm font-bold uppercase tracking-widest text-sun">
        <div className="mx-auto flex max-w-6xl justify-between gap-8 px-4">
          {words.map((w) => <span key={w}>{w}</span>)}
        </div>
      </div>
    </section>
  );
}

export default function Hero({ theme, ...p }: P & { theme: ThemeId }) {
  if (theme === 'elegante') return <HeroElegante {...p} />;
  if (theme === 'minimo') return <HeroMinimo {...p} />;
  return <HeroFesta {...p} />;
}
