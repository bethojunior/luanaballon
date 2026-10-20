import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { getUser, signUser, USER_COOKIE, userCookie } from '@/lib/userAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getUser();
  if (!s) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  await connectDB();
  const u = await User.findById(s.id);
  if (!u) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  return NextResponse.json({ name: u.name, email: u.email, phone: u.phone ?? '' });
}

export async function PUT(req: NextRequest) {
  const s = await getUser();
  if (!s) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || '').trim();
  if (name.length < 2) return NextResponse.json({ error: 'Informe seu nome.' }, { status: 400 });
  await connectDB();
  const u = await User.update(s.id, { name, phone: String(b.phone || '').trim() });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_COOKIE, await signUser({ id: s.id, name: u.name, email: s.email }), userCookie(req));
  return res;
}
