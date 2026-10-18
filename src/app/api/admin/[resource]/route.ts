import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RESOURCE_MODELS } from '@/lib/models';
import { sanitize, uniqueSlug } from '@/lib/crud';

type Ctx = { params: { resource: string } };

export async function GET(_: NextRequest, { params }: Ctx) {
  const r = RESOURCE_MODELS[params.resource];
  if (!r) return NextResponse.json({ error: 'Recurso inválido' }, { status: 404 });
  await connectDB();
  let q = r.model.find().sort(params.resource === 'categories' ? { order: 1, name: 1 } : { createdAt: -1 });
  if (params.resource === 'products') q = q.populate('category', 'name slug');
  return NextResponse.json(await q.lean());
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const r = RESOURCE_MODELS[params.resource];
  if (!r) return NextResponse.json({ error: 'Recurso inválido' }, { status: 404 });
  await connectDB();
  const data = sanitize(await req.json());
  if (!data[r.titleKey]) return NextResponse.json({ error: 'Preencha o título/nome' }, { status: 400 });
  data.slug = await uniqueSlug(r.model, data[r.titleKey]);
  if (params.resource === 'posts' && data.published) data.publishedAt = new Date();
  try {
    return NextResponse.json(await r.model.create(data), { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
