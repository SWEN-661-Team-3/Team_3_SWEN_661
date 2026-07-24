import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('mobile layout at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
    await expect(page.locator('.app-header')).toBeVisible();
  });

  test('tablet layout at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
    await expect(page.locator('.app-header')).toBeVisible();
  });

  test('desktop layout at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('care team page renders at all breakpoints', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/care-team');
      await expect(page.getByRole('heading', { name: 'Care Team', level: 1 })).toBeVisible();
    }
  });

  test('settings page renders at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
    await expect(page.getByText('Large Text')).toBeVisible();
  });
});
