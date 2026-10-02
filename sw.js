/**
 * ==========================================================================
 * GIET UNIVERSITY ALUMNI NETWORK — SERVICE WORKER
 * Cache-First / Stale-While-Revalidate + Network-First Navigation Strategy
 * Full Offline Support & Progressive Web App Experience
 * ==========================================================================
 */

const CACHE_NAME = 'giet-alumni-v1.0.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './directory.html',
  './events.html',
  './videos.html',
  './news.html',
  './profile.html',
  './login.html',
  './signup.html',
  './admin.html',
  './offline.html',
  './404.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/pages/home.css',
  './css/pages/directory.css',
  './css/pages/events.css',
  './css/pages/videos.css',
  './css/pages/news.css',
  './css/pages/profile.css',
  './css/pages/auth.css',
  './css/pages/admin.css',
  './js/nav.js',
  './js/auth.js',
  './js/storage-service.js',
  './js/pwa.js',
  './js/pages/home.js',
  './js/pages/directory.js',
  './js/pages/events.js',
  './js/pages/videos.js',
  './js/pages/news.js',
  './js/pages/profile.js',
  './js/pages/auth-page.js',
  './js/pages/admin.js',
  './giet-logo.webp',
  './hero-bg.JPG',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './favicon.png'
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache all assets; tolerate individual asset misses gracefully
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[PWA SW] Precache warning for ${url}:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/**
 * Service Worker Activation & Old Cache Pruning
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[PWA SW] Removing outdated cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Service Worker Fetch Interception
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET and chrome-extension / non-http requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // 1. Navigation Requests (HTML Pages): Network-First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlineFallback = await caches.match('./offline.html');
          return offlineFallback || new Response('Offline - GIET Alumni Network', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Fonts, Images): Stale-While-Revalidate
  const url = new URL(request.url);
  const isStatic =
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.JPG') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.json');

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Fallback for other requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).catch(() => {
        // Return null or empty response if network is down
        return new Response('', { status: 408, statusText: 'Request Timed Out' });
      });
    })
  );
});
