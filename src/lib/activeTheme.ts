import { cookies, headers } from 'next/headers';
import { LAYOUT_COOKIE, LAYOUT_HEADER, getTheme, normalizeTheme, themeFromFlag, type ThemeDef } from './themes';

/** Layout em uso: o da flag da URL (?l=2), se houver, senão o escolhido no painel. */
export function activeTheme(configured?: string): ThemeDef {
  const override = themeFromFlag(headers().get(LAYOUT_HEADER)) ?? themeFromFlag(cookies().get(LAYOUT_COOKIE)?.value);
  return getTheme(override ?? normalizeTheme(configured));
}
