import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { checkPassword, signUser, tooMany, USER_COOKIE, userCookie } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  if (tooMany(req, 'ulogin', 10)) return NextResponse.json({ error: 'Muitas tentativas. Aguarde alguns minutos.' }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');

  await connectDB();
  const u = email ? await User.findOne({ where: { email } }) : null;
  if (!u || !(await checkPassword(password, u.passwordHash))) {
    return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_COOKIE, await signUser({ id: u._id, name: u.name, email: u.email }), userCookie(req));
  return res;
}
