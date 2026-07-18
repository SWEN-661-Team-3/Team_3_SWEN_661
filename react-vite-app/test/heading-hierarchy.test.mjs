import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const root = process.cwd();

function source(path) {
  return readFileSync(join(root, path), 'utf8');
}

function h1Count(markup) {
  return (markup.match(/<h1\b/g) ?? []).length;
}

const routeHeadings = [
  ['src/pages/TodayPage.jsx', "Today&apos;s Plan"],
  ['src/pages/CareTeamPage.jsx', 'Care Team'],
  ['src/components/SettingsPanel.jsx', 'Accessibility Settings'],
  ['src/pages/EmergencyPage.jsx', 'Emergency'],
];

test('persistent CareConnect brand is visible but not rendered as a page h1', () => {
  const header = source('src/components/AppHeader.jsx');

  assert.match(header, /<span className="app-header__title">CareConnect<\/span>/);
  assert.doesNotMatch(header, /<h1\b[^>]*>CareConnect<\/h1>/);
  assert.doesNotMatch(header, /role="heading"|aria-level/);
});

test('each routed page has one explicit page-level h1', () => {
  for (const [path, heading] of routeHeadings) {
    const markup = source(path);

    assert.equal(h1Count(markup), 1, `${path} should declare one h1`);
    assert.match(markup, new RegExp(`<h1[^>]*>${heading}</h1>`));
  }
});

test("Today's Plan heading and introduction are visible to assistive technology", () => {
  const today = source('src/pages/TodayPage.jsx');

  assert.match(today, /<h1 className="page-title">Today&apos;s Plan<\/h1>/);
  assert.match(today, /<p className="page-subtitle">Here is today&apos;s plan\.<\/p>/);
  assert.doesNotMatch(today, /<div className="page-header" aria-hidden="true">/);
});

test('major section and dialog headings stay below page-heading level', () => {
  const sectionFiles = [
    'src/components/EmergencyPanel.jsx',
    'src/components/HeroCard.jsx',
    'src/components/Sidebar.jsx',
    'src/components/TaskDetailDialog.jsx',
    'src/components/CareMemberDetailDialog.jsx',
    'src/components/CareConnectDialog.jsx',
  ];

  for (const path of sectionFiles) {
    assert.equal(h1Count(source(path)), 0, `${path} should not declare a page h1`);
  }
});
