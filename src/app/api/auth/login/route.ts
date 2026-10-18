import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { COOKIE, signSession } from '@/lib/auth';

const safeEq = (a: string, b: string) => {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

export async function POST(req: NextRequest) {
  const { email = '', password = '' } = await req.json().catch(() => ({}));
  const okEmail = safeEq(String(email).trim().toLowerCase(), (process.env.ADMIN_EMAIL || '').trim().toLowerCase());
  const okPass = safeEq(String(password), process.env.ADMIN_PASSWORD || '');

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !okEmail || !okPass) {
    return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signSession(String(email)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.headers.get('x-forwarded-proto') === 'https',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
