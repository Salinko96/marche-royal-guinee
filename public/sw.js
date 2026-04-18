// Service Worker — MARCHÉ ROYAL DE GUINÉE
// Stratégie cache-first pour fonctionner avec l'internet instable en Guinée

const CACHE_NAME = 'marche-royal-v1';
const STATIC_CACHE = 'marche-royal-static-v1';
const API_CACHE = 'marche-royal-api-v1';

// Ressources à mettre en cache immédiatement à l'installation
const PRECACHE_URLS = [
  '/',
  '/suivi',
  '/produits',
  '/manifest.json',
  '/robots.txt',
];

// ─── Installation ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Ignorer les erreurs de précache (ex: réseau absent)
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Activation ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP et les extensions Chrome
  if (!request.url.startsWith('http')) return;
  if (url.protocol === 'chrome-extension:') return;

  // Stratégie pour les appels API produits publics → stale-while-revalidate
  if (url.pathname.startsWith('/api/products') || url.pathname.startsWith('/api/track')) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  // Ignorer les autres appels API (auth, admin, etc.)
  if (url.pathname.startsWith('/api/')) return;

  // Stratégie pour les assets statiques (images, CSS, JS) → cache-first
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff2?)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Stratégie pour les pages → network-first avec fallback cache
  event.respondWith(networkFirstWithCache(request, STATIC_CACHE));
});

// ─── Stratégies ─────────────────────────────────────────────

// Cache-first : essaie le cache, sinon réseau
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Ressource non disponible hors ligne', { status: 503 });
  }
}

// Network-first : essaie le réseau, sinon le cache
async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback page hors ligne
    const offlinePage = await caches.match('/');
    if (offlinePage) return offlinePage;

    return new Response(
      `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hors ligne — Marché Royal</title></head><body style="font-family:sans-serif;text-align:center;padding:2rem;background:#FFF9E6"><h1 style="color:#B8860B">Marché Royal de Guinée</h1><p>Vous êtes hors ligne. Reconnectez-vous pour accéder à la boutique.</p><a href="/" style="color:#B8860B;font-weight:bold">Réessayer</a></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// Stale-while-revalidate : cache immédiat + mise à jour en fond
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || fetchPromise || new Response(JSON.stringify([]), {
    headers: { 'Content-Type': 'application/json' }
  });
}
