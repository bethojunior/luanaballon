import type { CSSProperties } from 'react';
import { EVENTS, type Base } from './themeData';
import { EVENT_FX } from './fx';

export type ThemeDef = {
  id: string;
  name: string;
  /** evento/grupo ao qual o layout pertence */
  group: string;
  /** estrutura (cabeçalho, capa, formas e tipografia) */
  base: Base;
  emoji: string;
  badge: string;
  words: string[];
  description: string;
  /** [primária, secundária, terciária, quaternária] */
  swatches: [string, string, string, string];
  ink: string;
  cream: string;
  dark: boolean;
  /** animação de fundo extra deste layout (veja MOTIFS em fx.ts) */
  fx: string;
  /** layouts gerais usam as cores definidas no CSS; os demais aplicam a paleta inline */
  custom: boolean;
};

const BASE_DESC: Record<Base, string> = {
  festa: 'Colorido e divertido: confete, balões flutuando e cantos arredondados.',
  elegante: 'Sofisticado: tipografia com serifa, cantos retos e detalhes finos.',
  minimo: 'Moderno e direto: tipografia grande, faixas e sem enfeites.',
  baby: 'Delicado e acolhedor: nuvens, tons suaves e cantos bem arredondados.',
  noite: 'Brilho neon: fundo escuro, destaques luminosos e visual de balada.',
};

const GENERAL_FX: Record<string, string> = { festa: 'confetti', elegante: 'sparkles', minimo: 'confetti', baby: 'stars', noite: 'sparkles' };

/** Layouts gerais (os cinco originais). Mantêm os números 1 a 5 da flag. */
const GENERAL: ThemeDef[] = [
  { id: 'festa', name: 'Festa', base: 'festa', emoji: '🎈', badge: 'Festa pronta, é só pedir!', words: [], swatches: ['#FF3D8B', '#FFC83D', '#18C5C0', '#7B4DFF'], ink: '#2B1B3D', cream: '#FFFAF2', dark: false },
  { id: 'elegante', name: 'Elegante', base: 'elegante', emoji: '🎈', badge: 'Balões & Decoração', words: [], swatches: ['#B76E79', '#BE9646', '#7A9E8E', '#623E52'], ink: '#3A2A2E', cream: '#FCF8F3', dark: false },
  { id: 'minimo', name: 'Minimalista', base: 'minimo', emoji: '🎈', badge: 'Loja de festas', words: ['Balões', 'Arcos', 'Painéis', 'Kits de festa', 'Decoração', 'Personalizados'], swatches: ['#111111', '#D4FF3F', '#00968C', '#5050F0'], ink: '#111111', cream: '#FFFFFF', dark: false },
  { id: 'baby', name: 'Baby & Pastel', base: 'baby', emoji: '☁️', badge: 'Chá de bebê · Mesversário · Infantil', words: [], swatches: ['#E878A0', '#FFE082', '#8ECDE2', '#BEA5E8'], ink: '#544766', cream: '#FFFBF7', dark: false },
  { id: 'noite', name: 'Noite & Neon', base: 'noite', emoji: '🎈', badge: 'Decoração para a noite toda', words: ['Aniversários', 'Formaturas', '15 anos', 'Réveillon', 'Eventos', 'Balada'], swatches: ['#FF2E97', '#FFD60A', '#00E5FF', '#A06CFF'], ink: '#EEE8FF', cream: '#0E0A1C', dark: true },
].map((t) => ({ ...t, group: 'Geral', description: BASE_DESC[t.base as Base], custom: false, fx: GENERAL_FX[t.id] }) as ThemeDef);

const BY_EVENT: ThemeDef[] = EVENTS.flatMap((e) =>
  e.models.map(([label, base, swatches, ink, cream, dark], i) => ({
    id: `${e.slug}-${i + 1}`,
    name: `${e.name} · ${label}`,
    group: e.name,
    base,
    emoji: e.emoji,
    badge: e.badge,
    words: e.words,
    description: BASE_DESC[base],
    swatches,
    ink,
    cream,
    dark: !!dark,
    fx: EVENT_FX[e.slug] ?? 'confetti',
    custom: true,
  })),
);

export const THEMES: ThemeDef[] = [...GENERAL, ...BY_EVENT];
export const THEME_IDS = THEMES.map((t) => t.id);
export const DEFAULT_THEME = 'festa';

export type ThemeId = string;

export const getTheme = (id?: string): ThemeDef => THEMES.find((t) => t.id === id) ?? THEMES[0];
export const normalizeTheme = (t?: string): ThemeId => (THEME_IDS.includes(t as string) ? (t as string) : DEFAULT_THEME);

/** Grupos na ordem do catálogo (Geral primeiro, depois cada evento com seus 2 modelos). */
export const THEME_GROUPS = THEMES.reduce<{ group: string; items: ThemeDef[] }[]>((acc, t) => {
  const g = acc.find((x) => x.group === t.group);
  if (g) g.items.push(t);
  else acc.push({ group: t.group, items: [t] });
  return acc;
}, []);

/** Número do layout na flag da URL (?l=1 é o primeiro da lista, ?l=2 o segundo...). */
export const themeFlag = (id: string) => THEME_IDS.indexOf(id) + 1;

/**
 * Interpreta a flag `l`: número (2 ou l2), id (natal-2) ou só o evento (natal = modelo 1; natal2 = modelo 2).
 * Retorna undefined se inválida.
 */
export function themeFromFlag(flag?: string | null): ThemeId | undefined {
  const raw = (flag ?? '').trim().toLowerCase();
  if (!raw) return undefined;
  if (THEME_IDS.includes(raw)) return raw;
  if (THEME_IDS.includes(`${raw}-1`)) return `${raw}-1`;
  const m = raw.match(/^(.*?)-?([12])$/);
  if (m && THEME_IDS.includes(`${m[1]}-${m[2]}`)) return `${m[1]}-${m[2]}`;
  const n = raw.replace(/^l/, '');
  return /^\d+$/.test(n) ? THEMES[Number(n) - 1]?.id : undefined;
}

export const LAYOUT_COOKIE = 'luana_layout';
export const LAYOUT_HEADER = 'x-luana-layout';

/* ---------- paleta -> variáveis CSS ---------- */
type RGB = [number, number, number];
const rgb = (hex: string): RGB => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
};
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t)) as RGB;
const ch = (c: RGB) => c.join(' ');
const luminance = ([r, g, b]: RGB) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Variáveis de cor do layout (vazio nos layouts gerais, que usam o CSS). */
export function themeStyle(t: ThemeDef): CSSProperties {
  if (!t.custom) return {};
  const [p, s, a, g] = t.swatches.map(rgb);
  const cream = rgb(t.cream);
  const black: RGB = [0, 0, 0];
  const soft = (c: RGB, k: number) => ch(mix(c, cream, k));
  return {
    '--pink': ch(p),
    '--pink-dark': ch(mix(p, black, 0.2)),
    '--pink-soft': soft(p, t.dark ? 0.82 : 0.88),
    '--sun': ch(s),
    '--sun-dark': ch(mix(s, black, 0.2)),
    '--sun-soft': soft(s, 0.8),
    '--aqua': ch(a),
    '--aqua-soft': soft(a, 0.85),
    '--grape': ch(g),
    '--grape-soft': soft(g, 0.85),
    '--ink': ch(rgb(t.ink)),
    '--cream': ch(cream),
    '--surface': ch(mix(cream, [255, 255, 255], 0.07)),
    '--footer': ch(mix(cream, black, 0.4)),
    '--on-pink': luminance(p) > 0.6 ? '20 16 30' : '255 255 255',
  } as CSSProperties;
}
