// Service worker mínimo: habilita a instalação do PWA e uma página offline simples.
// Páginas e API sempre vão à rede (o conteúdo é dinâmico); só assets estáticos são cacheados.
const CACHE = 'luana-static-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  const isStatic = url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/');
  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sem conexão</title><body style="font-family:sans-serif;text-align:center;padding:4rem 1rem"><h1>Sem conexão</h1><p>Verifique sua internet e tente novamente.</p>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 },
          ),
      ),
    );
  }
});
