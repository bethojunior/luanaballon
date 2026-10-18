import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { BUCKET, ensureBucket, minio } from '@/lib/minio';

const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
const MAX = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 });

  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: 'Envie uma imagem (jpg, png, webp, gif ou avif)' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: 'Imagem acima de 10MB' }, { status: 400 });

  try {
    await ensureBucket();
    const now = new Date();
    const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${randomUUID()}.${ext}`;
    await minio().putObject(BUCKET, key, Buffer.from(await file.arrayBuffer()), file.size, {
      'Content-Type': file.type,
    });
    return NextResponse.json({ url: `/api/media/${key}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Falha ao salvar no MinIO' }, { status: 500 });
  }
}
