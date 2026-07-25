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
    await expect(page.getByRole('button', { name: 'Close dialog' })).toBeVisible();
    await expect(page.locator('dialog[open] .dialog__footer').getByRole('button')).toHaveText([
      'Mark Complete',
      'Edit Details',
      'Delete Reminder',
    ]);
  });

  test('marks a task complete and shows confirmation', async ({ page }) => {
    await page.goto('/');
    await page.locator('.task-list__btn').nth(1).click();
    await page.getByRole('button', { name: 'Mark Complete' }).click();
    await expect(page.getByRole('heading', { name: 'Reminder Complete', exact: true })).toBeVisible();
  });

  test('opens add reminder dialog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add Reminder' }).click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    await expect(page.locator('dialog[open] .edit-form')).toBeVisible();
  });

  test('shows reminder validation feedback without relying on browser validation bubbles', async ({ page }) => {
    await page.goto('/today');
    await page.getByRole('button', { name: 'Add Reminder' }).click();
    const dialog = page.locator('dialog[open]');

    await dialog.getByRole('button', { name: 'Add Reminder' }).click();
    await expect(dialog.getByRole('alert')).toContainText('Please correct the highlighted reminder fields.');
    await expect(dialog.getByRole('textbox', { name: /Reminder/ })).toHaveAttribute('aria-invalid', 'true');
  });

  test('shows a visible saving state for a deliberately slow reminder save', async ({ page }) => {
    await page.goto('/today?__e2e=slow-save-reminder');
    await page.getByRole('button', { name: 'Add Reminder' }).click();
    const dialog = page.locator('dialog[open]');

    await dialog.getByRole('textbox', { name: /Reminder/ }).fill('Call pharmacy');
    await dialog.getByRole('textbox', { name: /Time/ }).fill('11:00 AM');
    await dialog.getByRole('button', { name: 'Add Reminder' }).click();

    await expect(dialog.getByRole('status')).toContainText('Saving reminder...');
    await expect(dialog.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });

  test('shows retryable feedback when reminder completion is forced to fail', async ({ page }) => {
    await page.goto('/today?__e2e=fail-complete');
    await page.locator('.task-list__btn').nth(1).click();
    await page.getByRole('button', { name: 'Mark Complete' }).click();

    await expect(page.getByRole('alert')).toContainText('Could not mark this reminder complete.');
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
  });

  test('shows the empty reminder state in controlled E2E mode', async ({ page }) => {
    await page.goto('/today?__e2e=empty-plan');
    await expect(page.getByRole('heading', { name: 'No reminders yet', level: 2 })).toBeVisible();
    await expect(page.getByLabel('No reminders yet').getByRole('button', { name: 'Add Reminder' })).toBeVisible();
  });
});
