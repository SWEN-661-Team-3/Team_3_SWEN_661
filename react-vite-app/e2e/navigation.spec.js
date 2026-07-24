import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads the home page with Today\'s Plan heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
  });

  test('navigates to Care Team page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Care Team' }).click();
    await expect(page.getByRole('heading', { name: 'Care Team', level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/care-team');
  });

  test('navigates to Settings page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/settings');
  });

  test('navigates to Emergency page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Emergency' }).click();
    await expect(page.getByRole('heading', { name: 'Emergency', level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/emergency');
  });

  test('navigates back to Today via brand link', async ({ page }) => {
    await page.goto('/care-team');
    await page.getByLabel('CareConnect home').click();
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('renders header and footer on every page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await page.goto('/care-team');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
