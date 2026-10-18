import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import { RESOURCE_MODELS } from '@/lib/models';
import { sanitize, uniqueSlug } from '@/lib/crud';

type Ctx = { params: { resource: string; id: string } };

function resolve({ params }: Ctx) {
  const r = RESOURCE_MODELS[params.resource];
  return r && isValidObjectId(params.id) ? r : null;
}

const notFound = () => NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

export async function GET(_: NextRequest, ctx: Ctx) {
  const r = resolve(ctx);
  if (!r) return notFound();
  await connectDB();
  const doc = await r.model.findById(ctx.params.id).lean();
  return doc ? NextResponse.json(doc) : notFound();
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const r = resolve(ctx);
  if (!r) return notFound();
  await connectDB();
  const current: any = await r.model.findById(ctx.params.id).lean();
  if (!current) return notFound();

  const data = sanitize(await req.json());
  delete data.slug;
  if (data[r.titleKey] && data[r.titleKey] !== current[r.titleKey]) {
    data.slug = await uniqueSlug(r.model, data[r.titleKey], ctx.params.id);
  }
  if (ctx.params.resource === 'posts' && data.published && !current.publishedAt) data.publishedAt = new Date();

  try {
    const doc = await r.model.findByIdAndUpdate(ctx.params.id, { $set: data }, { new: true, runValidators: true }).lean();
    return NextResponse.json(doc);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, ctx: Ctx) {
  const r = resolve(ctx);
  if (!r) return notFound();
  await connectDB();
  await r.model.findByIdAndDelete(ctx.params.id);
  return NextResponse.json({ ok: true });
}
