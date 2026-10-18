import { connectDB } from './db';
import { Settings } from './models';
import { plain } from './utils';

export const SETTINGS_DEFAULTS = {
  layout: 'festa',
  storeName: 'Luana Balões',
  whatsapp: '5511999999999',
  heroTitle: 'Sua festa fica mais colorida com a Luana Balões!',
  heroSubtitle: 'Balões, decoração e tudo para transformar qualquer comemoração em um dia inesquecível.',
  instagram: '',
  email: '',
  address: '',
  aboutText: 'Somos apaixonados por festas! Trabalhamos com balões, arranjos e artigos de decoração para todas as ocasiões.',
  // SEO e compartilhamento
  siteUrl: '',
  seoTitle: 'Luana Balões | Balões e decoração para sua festa',
  seoDescription: 'Balões, decoração e artigos para festas. Arcos de balões, painéis e kits personalizados. Peça direto pelo WhatsApp!',
  seoKeywords: 'balões, decoração de festa, arco de balões, festa infantil, aniversário, painel de balões, artigos para festa',
  ogTitle: 'Luana Balões 🎈 Balões e decoração para sua festa',
  ogDescription: 'Sua festa mais colorida! Balões, arcos e decoração personalizada. Peça pelo WhatsApp.',
  ogImage: '',
};

export type SiteSettings = typeof SETTINGS_DEFAULTS;

export async function getSettings(): Promise<SiteSettings> {
  try {
    await connectDB();
    const s = await Settings.findOne({ where: { key: 'main' } });
    const clean = Object.fromEntries(Object.entries(plain(s ?? {})).filter(([, v]) => v));
    return { ...SETTINGS_DEFAULTS, ...clean };
  } catch {
    return SETTINGS_DEFAULTS;
  }
}

/** Executa uma consulta e devolve fallback se o banco estiver indisponível. */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDB();
    return plain(await fn());
  } catch (e) {
    console.error(e);
    return fallback;
  }
}
