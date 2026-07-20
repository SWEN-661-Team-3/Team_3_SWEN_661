import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const root = process.cwd();
const source = (path) => readFileSync(join(root, path), 'utf8');

test('offline banner shows the accessible notice when offline and hides when online', () => {
  const banner = source('src/components/OfflineStatusBanner.jsx');

  assert.match(banner, /!navigator\.onLine/);
  assert.match(banner, /addEventListener\('offline', showOffline\)/);
  assert.match(banner, /addEventListener\('online', showOnline\)/);
  assert.match(banner, /if \(!isOffline\) return null;/);
  assert.match(banner, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(banner, /You are offline\. Some information may be outdated, and some actions may be unavailable\./);
});

test('navigation uses the cached application shell before the static offline page', () => {
  const worker = source('src/service-worker.js');

  assert.match(worker, /precacheAndRoute\(self\.__WB_MANIFEST\)/);
  assert.match(worker, /matchPrecache\('\/index\.html'\)/);
  assert.match(worker, /matchPrecache\('\/offline\.html'\)/);
  assert.ok(worker.indexOf("matchPrecache('/index.html')") < worker.indexOf("matchPrecache('/offline.html')"));
  assert.ok(worker.indexOf('await fetch(request)') < worker.indexOf("matchPrecache('/index.html')"));
});

test('the static offline fallback is precached and works without JavaScript', () => {
  const offlinePage = source('public/offline.html');

  assert.match(offlinePage, /<title>CareConnect is unavailable offline<\/title>/);
  assert.match(offlinePage, /<button type="submit">Retry<\/button>/);
  assert.match(offlinePage, /<a href="\/">Go to CareConnect home<\/a>/);
  assert.doesNotMatch(offlinePage, /<script\b/i);
});
