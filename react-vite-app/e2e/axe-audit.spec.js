import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVIDENCE_DIR = join(__dirname, '../../assignments/week-12/evidence');

const routes = [
  { name: 'Today (Home)', path: '/today' },
  { name: 'Care Team', path: '/care-team' },
  { name: 'Caregiver Detail', path: '/care-team/sarah' },
  { name: 'Settings', path: '/settings' },
  { name: 'Notification Settings', path: '/settings/notifications' },
  { name: 'Emergency', path: '/emergency' },
];

const allResults = [];

test.describe('axe-core WCAG 2.1 AA Audit', () => {
  for (const route of routes) {
    test(`${route.name} (${route.path}) has no accessibility violations`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      allResults.push({
        route: route.name,
        path: route.path,
        violations: results.violations,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
      });

      mkdirSync(EVIDENCE_DIR, { recursive: true });
      writeFileSync(
        join(EVIDENCE_DIR, 'axe-results.json'),
        JSON.stringify(allResults, null, 2)
      );

      expect(results.violations).toEqual([]);
    });
  }
});

test.afterAll(async () => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });

  let md = '# axe-core WCAG 2.1 AA Audit Results\n\n';
  md += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Tool:** axe-core (via @axe-core/playwright)\n`;
  md += `**Standard:** WCAG 2.1 Level AA\n\n`;
  md += '## Summary\n\n';
  md += '| Page | Path | Violations | Passes | Incomplete |\n';
  md += '|------|------|------------|--------|------------|\n';

  for (const r of allResults) {
    md += `| ${r.route} | ${r.path} | ${r.violations.length} | ${r.passes} | ${r.incomplete} |\n`;
  }

  const totalViolations = allResults.reduce((sum, r) => sum + r.violations.length, 0);
  md += `\n**Total violations across all pages: ${totalViolations}**\n\n`;

  if (totalViolations > 0) {
    md += '## Violation Details\n\n';
    for (const r of allResults) {
      if (r.violations.length > 0) {
        md += `### ${r.route} (${r.path})\n\n`;
        for (const v of r.violations) {
          md += `- **${v.id}** (${v.impact}): ${v.description}\n`;
          md += `  - WCAG: ${v.tags.filter(t => t.startsWith('wcag')).join(', ')}\n`;
          md += `  - Nodes affected: ${v.nodes.length}\n`;
        }
        md += '\n';
      }
    }
  } else {
    md += '## Result\n\n';
    md += 'All pages pass WCAG 2.1 Level AA automated accessibility checks with zero violations.\n';
  }

  writeFileSync(join(EVIDENCE_DIR, 'axe-results.md'), md);
});
