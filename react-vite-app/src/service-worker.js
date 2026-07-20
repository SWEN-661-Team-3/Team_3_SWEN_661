import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cached React routes use the application shell; the static page is only for a missing shell.
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && /^\/(?!api)/.test(url.pathname),
  async ({ request }) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse) return networkResponse;
    } catch {
      // Continue to the cached shell when navigation is unavailable offline.
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
