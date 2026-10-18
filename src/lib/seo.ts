import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { getSettings } from './data';

/** URL base do site: a configurada no painel ou, se vazia, a detectada pela requisição. */
export function siteBase(configured?: string) {
  if (configured) return new URL(/^https?:\/\//.test(configured) ? configured : `https://${configured}`);
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost';
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  return new URL(`${proto}://${host}`);
}

export async function siteMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const images = s.ogImage ? [s.ogImage] : undefined;
  return {
    metadataBase: siteBase(s.siteUrl),
    title: { default: s.seoTitle, template: `%s | ${s.storeName}` },
    description: s.seoDescription,
    keywords: s.seoKeywords || undefined,
    icons: { icon: '/favicon.svg', apple: '/icons/apple-touch-icon.png' },
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: s.storeName },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: s.storeName,
      title: s.ogTitle || s.seoTitle,
      description: s.ogDescription || s.seoDescription,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: s.ogTitle || s.seoTitle,
      description: s.ogDescription || s.seoDescription,
      images,
    },
  };
}
