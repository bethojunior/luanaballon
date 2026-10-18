import { Client } from 'minio';

const g = globalThis as any;

export const BUCKET = process.env.MINIO_BUCKET || 'luana';

export function minio(): Client {
  g._minio ||= new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  });
  return g._minio;
}

export async function ensureBucket() {
  if (g._bucketReady) return;
  const c = minio();
  if (!(await c.bucketExists(BUCKET))) await c.makeBucket(BUCKET);
  g._bucketReady = true;
}
