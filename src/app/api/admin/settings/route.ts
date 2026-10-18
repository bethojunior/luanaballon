import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Settings } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  return NextResponse.json((await Settings.findOne({ key: 'main' }).lean()) ?? {});
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { _id, __v, key, ...data } = await req.json();
  const doc = await Settings.findOneAndUpdate({ key: 'main' }, { $set: data }, { upsert: true, new: true }).lean();
  return NextResponse.json(doc);
}
