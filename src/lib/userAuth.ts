import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const USER_COOKIE = 'luana_user';
export type SessionUser = { id: number; name: string; email: string };

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(pw, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function checkPassword(pw: string, stored: string) {
  const [s, h] = (stored || '').split(':');
  if (!s || !h) return false;
  const expected = Buffer.from(h, 'hex');
  const actual = await scrypt(pw, Buffer.from(s, 'hex'), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const signUser = (u: SessionUser) =>
  new SignJWT({ name: u.name, email: u.email, kind: 'user' }).setSubject(String(u.id)).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('30d').sign(secret());

export async function readUser(token?: string): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.kind !== 'user') return null;
    return { id: Number(payload.sub), name: String(payload.name), email: String(payload.email) };
  } catch {
    return null;
  }
}

/** Cliente logado (lido do cookie), para uso em páginas e rotas do servidor. */
export const getUser = () => readUser(cookies().get(USER_COOKIE)?.value);

export const userCookie = (req: NextRequest, maxAge = 60 * 60 * 24 * 30) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: req.headers.get('x-forwarded-proto') === 'https',
  path: '/',
  maxAge,
});

/** Limite simples de tentativas por IP (memória do processo). */
const hits = new Map<string, number[]>();
export function tooMany(req: NextRequest, bucket: string, max = 10, windowMs = 10 * 60 * 1000) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}
