import { test } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVIDENCE_DIR = join(__dirname, '../../assignments/week-12/evidence');
const SCREENSHOTS_DIR = join(EVIDENCE_DIR, 'screenshots');

test.describe('Evidence Screenshots', () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  });

  test('screenshot of Lighthouse HTML report', async ({ page }) => {
    const reportPath = join(EVIDENCE_DIR, 'lighthouse-report.html').replace(/\\/g, '/');
    await page.goto(`file:///${reportPath}`);
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, '09-lighthouse-score.png'),
      clip: { x: 0, y: 0, width: 1280, height: 600 },
    });
  });

  test('screenshot of coverage results', async ({ page }) => {
    const coveragePath = join(EVIDENCE_DIR, 'coverage', 'coverage-visual.html').replace(/\\/g, '/');
    await page.goto(`file:///${coveragePath}`);
    await page.waitForLoadState('load');
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, '10-coverage-results.png'),
      fullPage: true,
    });
  });
});
