import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// skipWaiting + clientsClaim ensures the new service worker takes over
// immediately on update, so users always run the latest cached build
// without needing to close all tabs. This is acceptable for a care-plan
// app where stale cache data is low-risk.
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Offline routing strategy: all navigation requests fall back to the
// precached /index.html application shell, which lets React Router handle
// client-side routing even when offline. The static /offline.html page is
// a last resort for when the shell itself is unavailable (e.g. first visit
// with no cache). Host-level SPA rewrites (vercel.json) handle the same
// concern on the server side for direct URL access while online.
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
