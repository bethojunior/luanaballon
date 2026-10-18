import Link from 'next/link';
import Balloon from './Balloon';
import type { SiteSettings } from '@/lib/data';
import type { ThemeDef } from '@/lib/themes';

type P = { s: SiteSettings; featured: any[]; def: ThemeDef };

const wa = (s: SiteSettings) => `https://wa.me/${s.whatsapp}`;

function Buttons({ s }: { s: SiteSettings }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/produtos" className="btn-primary">Ver produtos</Link>
      <a href={wa(s)} target="_blank" rel="noreferrer" className="btn-sun">💬 Falar no WhatsApp</a>
    </div>
  );
}

function HeroFesta({ s, def }: P) {
  return (
    <section className="confetti relative overflow-hidden">
      <Balloon color="pink" className="absolute left-[4%] top-10 w-16 sm:w-24" />
      <Balloon color="aqua" className="absolute right-[6%] top-6 w-14 sm:w-20" delay={1} />
      <Balloon color="sun" className="absolute bottom-6 left-[14%] hidden w-16 sm:block" delay={2} />
      <Balloon color="grape" className="absolute bottom-10 right-[14%] hidden w-20 sm:block" delay={0.5} />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <span className="inline-block rounded-full bg-sun px-4 py-1 text-sm font-extrabold">{def.emoji} {def.badge}</span>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-pink sm:text-6xl">{s.heroTitle}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">{s.heroSubtitle}</p>
        <div className="flex justify-center"><Buttons s={s} /></div>
      </div>
    </section>
  );
}

function HeroElegante({ s, featured, def }: P) {
  const heights = ['h-64', 'h-80', 'h-56'];
  const tones = ['pink', 'sun', 'aqua'];
  return (
    <section className="confetti">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-sun">{def.badge}</p>
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

function HeroMinimo({ s, def }: P) {
  const words = def.words;
  return (
    <section className="border-b border-ink">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <p className="inline-block bg-sun px-3 py-1 text-sm font-bold uppercase tracking-wide">{def.badge}</p>
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

function HeroBaby({ s, def }: P) {
  return (
    <section className="confetti relative overflow-hidden">
      <div className="absolute -left-10 top-16 h-24 w-56 rounded-full bg-white/80 blur-[2px]" />
      <div className="absolute -right-12 top-32 h-20 w-48 rounded-full bg-white/80 blur-[2px]" />
      <Balloon color="aqua" className="absolute left-[7%] top-14 w-14 sm:w-20" />
      <Balloon color="pink" className="absolute right-[8%] top-10 w-16 sm:w-24" delay={1.2} />
      <Balloon color="sun" className="absolute bottom-8 right-[18%] hidden w-14 sm:block" delay={2} />
      <Balloon color="grape" className="absolute bottom-10 left-[16%] hidden w-16 sm:block" delay={0.6} />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <span className="inline-block rounded-full bg-aqua-soft px-4 py-1 text-sm font-extrabold text-ink">{def.emoji} {def.badge}</span>
        <h1 className="mt-5 text-4xl leading-tight text-pink sm:text-6xl">{s.heroTitle}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">{s.heroSubtitle}</p>
        <div className="flex justify-center"><Buttons s={s} /></div>
      </div>
    </section>
  );
}

function HeroNoite({ s, featured, def }: P) {
  const words = def.words;
  const img = featured[0]?.images?.[0];
  return (
    <section className="confetti relative overflow-hidden border-b border-pink/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-aqua [text-shadow:0_0_12px_rgb(var(--aqua))]">{def.badge}</p>
          <h1 className="mt-5 text-4xl font-bold uppercase leading-[1.05] sm:text-6xl">{s.heroTitle}</h1>
          <p className="mt-6 max-w-lg text-lg text-ink/75">{s.heroSubtitle}</p>
          <Buttons s={s} />
        </div>
        <div className="relative mx-auto h-72 w-full max-w-sm sm:h-96">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="h-full w-full rounded-2xl border border-pink/60 object-cover shadow-[0_0_40px_-8px_rgb(var(--pink))]" />
          ) : (
            <>
              <Balloon color="pink" className="absolute left-2 top-4 w-28 drop-shadow-[0_0_18px_rgb(var(--pink))]" />
              <Balloon color="aqua" className="absolute right-4 top-0 w-24 drop-shadow-[0_0_18px_rgb(var(--aqua))]" delay={1} />
              <Balloon color="sun" className="absolute bottom-0 left-24 w-24 drop-shadow-[0_0_18px_rgb(var(--sun))]" delay={2} />
              <Balloon color="grape" className="absolute bottom-6 right-6 w-20 drop-shadow-[0_0_18px_rgb(var(--grape))]" delay={0.5} />
            </>
          )}
        </div>
      </div>
      <div className="overflow-hidden whitespace-nowrap border-t border-pink/40 bg-black/30 py-3 text-xs font-bold uppercase tracking-[0.3em] text-sun">
        <div className="mx-auto flex max-w-6xl justify-between gap-8 px-4">
          {words.map((w) => <span key={w}>{w}</span>)}
        </div>
      </div>
    </section>
  );
}

export default function Hero({ theme, ...p }: Omit<P, 'def'> & { theme: ThemeDef }) {
  const q = { ...p, def: theme };
  if (theme.base === 'elegante') return <HeroElegante {...q} />;
  if (theme.base === 'minimo') return <HeroMinimo {...q} />;
  if (theme.base === 'baby') return <HeroBaby {...q} />;
  if (theme.base === 'noite') return <HeroNoite {...q} />;
  return <HeroFesta {...q} />;
}
