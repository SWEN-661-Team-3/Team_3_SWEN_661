import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('redirects the home page to Today\'s Plan', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/today');
  });

  test('navigates to Care Team page', async ({ page }) => {
    await page.goto('/today');
    await page.getByRole('link', { name: 'Care Team' }).click();
    await expect(page.getByRole('heading', { name: 'Care Team', level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/care-team');
  });

  test('navigates to Settings page', async ({ page }) => {
    await page.goto('/today');
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/settings');
  });

  test('navigates to Emergency page', async ({ page }) => {
    await page.goto('/today');
    await page.getByRole('link', { name: 'Emergency' }).click();
    await expect(page.getByRole('heading', { name: 'Emergency', level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/emergency');
  });

  test('supports deep linking to a caregiver detail route', async ({ page }) => {
    await page.goto('/care-team/sarah');
    await expect(page.getByRole('heading', { name: 'Sarah Johnson', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to Care Team' })).toHaveAttribute('href', '/care-team');
    await page.getByRole('link', { name: 'Back to Care Team' }).click();
    await expect(page).toHaveURL('/care-team');

    await page.goto('/settings/notifications');
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
  });

  test('navigates back to Today via brand link', async ({ page }) => {
    await page.goto('/care-team');
    await page.getByLabel('CareConnect home').click();
    await expect(page.getByRole('heading', { name: "Today's Plan", level: 1 })).toBeVisible();
    await expect(page).toHaveURL('/today');
  });

  test('renders the client-side 404 page for a direct invalid URL', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    await expect(page).toHaveTitle('Page Not Found - CareConnect');
    await expect(page.getByRole('heading', { name: 'Page Not Found', level: 1 })).toBeVisible();
    await expect(page.getByText('/this-page-does-not-exist')).toBeVisible();
    await page.getByRole('link', { name: /Go to Today's Plan/ }).click();
    await expect(page).toHaveURL('/today');
  });

  test('renders header and footer on every page', async ({ page }) => {
    await page.goto('/today');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await page.goto('/care-team');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
