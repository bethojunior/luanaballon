import { NextRequest, NextResponse } from 'next/server';
import { COOKIE, verifySession } from '@/lib/auth';
import { LAYOUT_COOKIE, LAYOUT_HEADER, themeFromFlag } from '@/lib/themes';

/** Site público: ?l=2 (ou l=elegante) troca o layout; ?l=0 volta ao layout escolhido no painel. */
function siteLayoutFlag(req: NextRequest) {
  const flag = req.nextUrl.searchParams.get('l');
  if (flag === null) return NextResponse.next();

  const theme = themeFromFlag(flag);
  const headers = new Headers(req.headers);
  const res = (h?: Headers) => NextResponse.next(h ? { request: { headers: h } } : undefined);

  if (theme) {
    headers.set(LAYOUT_HEADER, theme);
    const r = res(headers);
    r.cookies.set(LAYOUT_COOKIE, theme, { path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' });
    return r;
  }
  const r = res();
  r.cookies.delete(LAYOUT_COOKIE);
  return r;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) return siteLayoutFlag(req);
  if (pathname === '/admin/login') return NextResponse.next();

  if (await verifySession(req.cookies.get(COOKIE)?.value)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

export const config = {
  matcher: ['/', '/produtos/:path*', '/blog/:path*', '/carrinho', '/admin/:path*', '/api/admin/:path*'],
};
