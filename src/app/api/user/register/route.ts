import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { hashPassword, signUser, tooMany, USER_COOKIE, userCookie } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  if (tooMany(req, 'register', 8)) return NextResponse.json({ error: 'Muitas tentativas. Aguarde alguns minutos.' }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const phone = String(b.phone || '').trim();
  const password = String(b.password || '');

  if (name.length < 2) return NextResponse.json({ error: 'Informe seu nome.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'A senha precisa ter pelo menos 6 caracteres.' }, { status: 400 });

  await connectDB();
  if (await User.exists({ email })) return NextResponse.json({ error: 'Este e-mail já está cadastrado. Faça login.' }, { status: 409 });

  const u = await User.create({ name, email, phone, passwordHash: await hashPassword(password) });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_COOKIE, await signUser({ id: u._id, name: u.name, email: u.email }), userCookie(req));
  return res;
}
