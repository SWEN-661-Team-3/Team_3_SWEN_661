import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const root = process.cwd();

function source(path) {
  return readFileSync(join(root, path), 'utf8');
}

test('reminder details exposes the expected view actions', () => {
  const dialog = source('src/components/TaskDetailDialog.jsx');

  assert.match(dialog, />\s*Close\s*<\/button>/);
  assert.match(dialog, />\s*Edit Details\s*<\/button>/);
  assert.match(dialog, />\s*Mark Complete\s*<\/button>/);
});

test('mark complete skips the old pre-completion confirmation and opens title-specific success', () => {
  const today = source('src/pages/TodayPage.jsx');

  assert.doesNotMatch(today, /pendingCompleteId/);
  assert.doesNotMatch(today, /Complete Reminder\?/);
  assert.doesNotMatch(today, /Keep Pending/);
  assert.match(today, /setPlan\(\(prev\) =>\s*prev\.map\(\(t\) => \(t\.id === id \? \{ \.\.\.t, status: 'done' \} : t\)\),\s*\)/);
  assert.match(today, /title="Reminder Complete"/);
  assert.match(today, /message=\{`"\$\{completeNotice\?\.title \?\? 'Reminder'\}" was marked complete\.`\}/);
  assert.match(today, /variant="success"/);
});

test('success dialog has a single OK action and returns focus to the completed reminder card', () => {
  const today = source('src/pages/TodayPage.jsx');
  const dialog = source('src/components/CareConnectDialog.jsx');
  const sidebar = source('src/components/Sidebar.jsx');

  assert.match(today, /onConfirm=\{closeCompleteNotice\}/);
  assert.match(today, /taskButtonRefs\.current\[completedId\]\?\.focus\(\)/);
  assert.match(sidebar, /ref=\{getTaskButtonRef\?\.\(task\.id\)\}/);
  assert.match(dialog, /confirmLabel = 'OK'/);
  assert.match(dialog, /aria-labelledby="careconnect-dialog-title"/);
  assert.match(dialog, /<button type="button" className=\{confirmButtonClass\} onClick=\{onConfirm\}>/);
});

test('completed reminders keep using the existing completed visual classes', () => {
  const sidebar = source('src/components/Sidebar.jsx');
  const styles = source('src/styles/app.css');

  assert.match(sidebar, /task-list__btn--done/);
  assert.match(styles, /\.task-list__btn--done\s*\{\s*background: var\(--color-success-bg\);\s*border-color: var\(--color-success\);/);
  assert.match(styles, /\.task-list__btn--done \.task-list__status,\s*\.task-list__btn--done \.task-list__title\s*\{\s*color: var\(--color-success\);/);
  assert.match(styles, /\.dialog--success\s*\{\s*border-color: var\(--color-success\);\s*background: var\(--color-success-bg\);/);
});

test('motion preference keeps dialogs and completed reminders functional without waits', () => {
  const app = source('src/App.jsx');
  const today = source('src/pages/TodayPage.jsx');
  const taskDialog = source('src/components/TaskDetailDialog.jsx');
  const memberDialog = source('src/components/CareMemberDetailDialog.jsx');
  const confirmationDialog = source('src/components/CareConnectDialog.jsx');
  const styles = source('src/styles/app.css');

  assert.match(app, /document\.body\.classList\.toggle\('reduce-motion', settings\.reduceMotion\)/);
  assert.match(app, /document\.body\.classList\.remove\([^)]*'reduce-motion'/);
  assert.match(today, /status: 'done'/);
  assert.match(today, /setDetailOpen\(false\)/);
  assert.match(today, /open=\{Boolean\(completeNotice\)\}/);
  assert.match(taskDialog, /className="dialog"/);
  assert.match(memberDialog, /className="dialog"/);
  assert.match(confirmationDialog, /className=\{`dialog dialog--confirm/);
  assert.match(taskDialog, /showModal\(\)/);
  assert.match(memberDialog, /showModal\(\)/);
  assert.match(confirmationDialog, /showModal\(\)/);
  assert.match(taskDialog, /classList\.add\('dialog--enter'\)/);
  assert.match(memberDialog, /classList\.add\('dialog--enter'\)/);
  assert.match(confirmationDialog, /classList\.add\('dialog--enter'\)/);
  assert.match(styles, /\.dialog\.dialog--enter\s*\{\s*animation: dialog-enter 180ms ease-out;/);
  assert.match(styles, /\.task-list__btn--done\s*\{[\s\S]*animation: reminder-complete 180ms ease-out;/);
  assert.match(styles, /body\.reduce-motion \*,[\s\S]*animation-duration: 0\.01ms !important;[\s\S]*transition-duration: 0\.01ms !important;/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms !important;[\s\S]*transition-duration: 0\.01ms !important;/);
  assert.doesNotMatch(today, /setTimeout|animationend/);
});

test('remove and unsaved-change confirmations remain available', () => {
  const careMemberDialog = source('src/components/CareMemberDetailDialog.jsx');
  const taskDialog = source('src/components/TaskDetailDialog.jsx');

  assert.match(careMemberDialog, /title="Remove Helper\?"/);
  assert.match(careMemberDialog, /confirmLabel="Remove Helper"/);
  assert.match(careMemberDialog, /variant="destructive"/);
  assert.match(taskDialog, /title="Close Without Saving\?"/);
  assert.match(taskDialog, /confirmLabel="Close Without Saving"/);
});
