import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// skipWaiting + clientsClaim lets an installed update control open clients
// promptly. Offline navigation can still use the installed worker's cached
// shell, so cached content is not guaranteed to be the newest deployment.
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Offline navigation falls back to the precached /index.html shell so React
// Router can resolve client routes. /offline.html is only for a first/offline
// visit with no shell. This service-worker fallback is separate from the
// host SPA rewrite, which serves index.html for direct online requests.
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && /^\/(?!api)/.test(url.pathname),
  async ({ request }) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse) return networkResponse;
    } catch {
      // Network unavailable -- serve from cache.
    }

    return (await matchPrecache('/index.html'))
      ?? (await matchPrecache('/offline.html'))
      ?? Response.error();
  },
);

registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new CacheFirst({
  cacheName: 'google-fonts-cache',
  plugins: [
    new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    new CacheableResponsePlugin({ statuses: [0, 200] }),
  ],
}));

registerRoute(/\.(?:png|jpg|jpeg|svg|gif|webp)$/, new CacheFirst({
  cacheName: 'images-cache',
  plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 })],
}));

registerRoute(/^https:\/\/api\..*/i, new NetworkFirst({
  cacheName: 'api-cache',
  networkTimeoutSeconds: 10,
  plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 })],
}));
