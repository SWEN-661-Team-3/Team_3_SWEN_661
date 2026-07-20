import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const root = process.cwd();

function source(path) {
  return readFileSync(join(root, path), 'utf8');
}

test('shared dialog supports a destructive variant with a red primary action', () => {
  const dialog = source('src/components/CareConnectDialog.jsx');
  const styles = source('src/styles/app.css');

  assert.match(dialog, /variant === 'destructive' \? 'danger-btn' : 'primary-btn'/);
  assert.match(dialog, /className=\{`dialog dialog--confirm\$\{variant \? ` dialog--\$\{variant\}` : ''\}`\}/);
  assert.match(styles, /\.dialog--destructive\s*\{\s*border-color: var\(--color-emergency\);\s*background: var\(--color-emergency-bg\);/);
  assert.match(styles, /\.dialog--destructive \.dialog__header\s*\{\s*border-bottom-color: var\(--color-emergency\);/);
  assert.match(styles, /\.dialog--destructive \.dialog__header h2\s*\{\s*color: var\(--color-emergency\);/);
});

test('permanent care team removal uses the destructive confirmation variant', () => {
  const careMemberDialog = source('src/components/CareMemberDetailDialog.jsx');

  assert.match(careMemberDialog, /title="Remove Helper\?"/);
  assert.match(careMemberDialog, /cancelLabel="Keep Helper"/);
  assert.match(careMemberDialog, /confirmLabel="Remove Helper"/);
  assert.match(careMemberDialog, /variant="destructive"/);
  assert.match(careMemberDialog, /onRemove\(member\.id\)/);
});

test('success dialogs continue to use the green success variant', () => {
  const today = source('src/pages/TodayPage.jsx');
  const careTeam = source('src/pages/CareTeamPage.jsx');

  assert.match(today, /title="Reminder Complete"[\s\S]*variant="success"/);
  assert.match(careTeam, /open=\{Boolean\(saveNotice\)\}[\s\S]*variant="success"/);
  assert.doesNotMatch(today, /title="Reminder Complete"[\s\S]*variant="destructive"/);
});
