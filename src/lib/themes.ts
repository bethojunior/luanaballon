export const THEMES = [
  {
    id: 'festa',
    name: 'Festa',
    description: 'Colorido e divertido: confete, balões flutuando e cantos arredondados.',
    swatches: ['#FF3D8B', '#FFC83D', '#18C5C0', '#7B4DFF'],
  },
  {
    id: 'elegante',
    name: 'Elegante',
    description: 'Sofisticado: tons rosé e dourado, tipografia com serifa e cantos retos. Ideal para festas premium e casamentos.',
    swatches: ['#B76E79', '#BE9646', '#7A9E8E', '#623E52'],
  },
  {
    id: 'minimo',
    name: 'Minimalista',
    description: 'Moderno e direto: preto e branco com destaque em lima, tipografia grande e sem enfeites.',
    swatches: ['#111111', '#D4FF3F', '#00968C', '#5050F0'],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];
export const THEME_IDS = THEMES.map((t) => t.id) as string[];
export const DEFAULT_THEME: ThemeId = 'festa';

export const normalizeTheme = (t?: string): ThemeId => (THEME_IDS.includes(t as string) ? (t as ThemeId) : DEFAULT_THEME);
