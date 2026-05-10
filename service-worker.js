/* service-worker.js — Türkiye'yi Keşfet PWA
 *
 * Cache stratejisi:
 *  - APP_SHELL: index.html, styles.css, ikonlar, manifest → cache-first (uygulama hızlı açılsın)
 *  - CDN_DEPS:  React/Babel/Leaflet kütüphaneleri → stale-while-revalidate
 *  - TILES:     Harita tile'ları (CartoDB) → runtime cache, max 200 entry
 *  - FONTS:     Google Fonts → cache-first (uzun ömürlü)
 *
 * Sürüm değişince eski cache'ler temizlenir (CACHE_VERSION).
 */

const CACHE_VERSION = 'tk-v1.2.0'; // pusula ikonu krem arka fon + safe-zone → cache invalidate
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const TILES_CACHE = `${CACHE_VERSION}-tiles`;
const FONTS_CACHE = `${CACHE_VERSION}-fonts`;

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
];

/* ========== INSTALL — App shell'i pre-cache et ========== */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Some app shell items failed to cache:', err);
        // Tek tek deneyelim, hatalı olanı atlayalım
        return Promise.allSettled(APP_SHELL.map(url => cache.add(url)));
      }))
      .then(() => self.skipWaiting())
  );
});

/* ========== ACTIVATE — Eski cache'leri temizle ========== */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ========== Yardımcı fonksiyonlar ========== */
const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return cached || new Response('Offline', { status: 503 });
  }
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((response) => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || networkPromise;
};

const limitCacheSize = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
};

/* ========== FETCH — istek tipine göre yönlendir ========== */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Map tiles (CartoDB)
  if (url.hostname.includes('cartodb-basemaps') ||
      url.hostname.includes('basemaps.cartocdn.com') ||
      url.pathname.endsWith('.png') && url.hostname.includes('cdn')) {
    event.respondWith(
      cacheFirst(request, TILES_CACHE).then((response) => {
        limitCacheSize(TILES_CACHE, 200);
        return response;
      })
    );
    return;
  }

  // Google Fonts
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(request, FONTS_CACHE));
    return;
  }

  // CDN libraries (React, Leaflet, Babel)
  if (url.hostname.includes('unpkg.com')) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // Same-origin (app shell + assets)
  if (url.origin === self.location.origin) {
    event.respondWith(
      cacheFirst(request, APP_SHELL_CACHE).then((response) => {
        // Update strategy: try network in background to refresh
        fetch(request).then((fresh) => {
          if (fresh && fresh.ok) {
            caches.open(APP_SHELL_CACHE).then(c => c.put(request, fresh.clone()));
          }
        }).catch(() => {});
        return response;
      })
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

/* ========== SKIP WAITING — yeni SW geldiğinde ========== */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
