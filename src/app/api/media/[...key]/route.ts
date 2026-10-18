import { Readable } from 'stream';
import { BUCKET, minio } from '@/lib/minio';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { key: string[] } }) {
  const key = params.key.join('/');
  try {
    const c = minio();
    const stat = await c.statObject(BUCKET, key);
    const stream = await c.getObject(BUCKET, key);
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        'Content-Type': stat.metaData?.['content-type'] || 'application/octet-stream',
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
