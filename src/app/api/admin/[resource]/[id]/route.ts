import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { RESOURCE_MODELS } from '@/lib/models';
import { sanitize, uniqueSlug, validate } from '@/lib/crud';

type Ctx = { params: { resource: string; id: string } };

function resolve({ params }: Ctx) {
  const r = RESOURCE_MODELS[params.resource];
  return r && /^\d+$/.test(params.id) ? r : null;
}

const notFound = () => NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

export async function GET(_: NextRequest, ctx: Ctx) {
  const r = resolve(ctx);
  if (!r) return notFound();
  await connectDB();
  const doc = await r.model.findById(ctx.params.id);
  return doc ? NextResponse.json(doc) : notFound();
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const r = resolve(ctx);
  if (!r) return notFound();
  await connectDB();
  const current: any = await r.model.findById(ctx.params.id);
  if (!current) return notFound();

  const data = sanitize(await req.json());
  delete data.slug;
  const invalid = validate(ctx.params.resource, data, false);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
  if (data[r.titleKey] && data[r.titleKey] !== current[r.titleKey]) {
    data.slug = await uniqueSlug(r.model, data[r.titleKey], ctx.params.id);
  }
  if (ctx.params.resource === 'posts' && data.published && !current.publishedAt) data.publishedAt = new Date();

  try {
    return NextResponse.json(await r.model.update(ctx.params.id, data));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, ctx: Ctx) {
  const r = resolve(ctx);
  if (!r) return notFound();
  await connectDB();
  await r.model.remove(ctx.params.id);
  return NextResponse.json({ ok: true });
}
