import { test } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, '../../assignments/week-12/evidence/screenshots');

const routes = [
  { name: '01-today-page', path: '/today' },
  { name: '02-care-team', path: '/care-team' },
  { name: '03-caregiver-detail', path: '/care-team/sarah' },
  { name: '04-settings', path: '/settings' },
  { name: '05-notification-settings', path: '/settings/notifications' },
  { name: '06-emergency', path: '/emergency' },
];

test.describe('Web App Screenshots', () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  });

  for (const route of routes) {
    test(`capture ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: join(SCREENSHOTS_DIR, `${route.name}.png`),
        fullPage: true,
      });
    });
  }

  test('capture today-page mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/today');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, '07-today-mobile.png'),
      fullPage: true,
    });
  });

  test('capture care-team mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/care-team');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, '08-care-team-mobile.png'),
      fullPage: true,
    });
  });
});
