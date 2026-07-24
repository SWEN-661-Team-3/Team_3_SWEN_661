import { test, expect } from '@playwright/test';

test.describe('Task Workflow', () => {
  test('displays all tasks in the sidebar', async ({ page }) => {
    await page.goto('/');
    const taskItems = page.locator('.task-list__item');
    await expect(taskItems).toHaveCount(6);
  });

  test('displays the hero card with next pending task', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-card')).toBeVisible();
    await expect(page.locator('.hero-card__title')).toBeVisible();
  });

  test('displays stats row with correct counts', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.stat-card')).toHaveCount(2);
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Remaining')).toBeVisible();
  });

  test('opens task detail dialog from sidebar', async ({ page }) => {
    await page.goto('/');
    await page.locator('.task-list__btn').nth(1).click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
  });

  test('marks a task complete and shows confirmation', async ({ page }) => {
    await page.goto('/');
    await page.locator('.task-list__btn').nth(1).click();
    await page.getByRole('button', { name: 'Mark Complete' }).click();
    await expect(page.getByText('Reminder Complete')).toBeVisible();
  });

  test('opens add reminder dialog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add Reminder' }).click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    await expect(page.locator('dialog[open] .edit-form')).toBeVisible();
  });
});
