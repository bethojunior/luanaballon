import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Settings } from '@/lib/models';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { _id, id, key, createdAt, updatedAt, ...data } = await req.json();
  return NextResponse.json(await Settings.upsert({ key: 'main' }, data));
}
