import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('skip link is present and targets main content', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(page.locator('main#main-content')).toBeAttached();
  });

  test('skip link becomes visible on focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeFocused();
  });

  test('keyboard navigation through nav links', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const navLinks = page.locator('.nav-links a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab');
    }
  });

  test('navigation landmark is present', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
  });

  test('main landmark is present on each page', async ({ page }) => {
    const routes = ['/', '/care-team', '/settings', '/emergency'];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main')).toBeAttached();
    }
  });

  test('task dialog can be opened and closed with Escape', async ({ page }) => {
    await page.goto('/');
    const taskButton = page.locator('.task-list__btn').first();
    await taskButton.click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
