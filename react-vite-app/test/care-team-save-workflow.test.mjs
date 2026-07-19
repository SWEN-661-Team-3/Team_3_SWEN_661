import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const root = process.cwd();

function source(path) {
  return readFileSync(join(root, path), 'utf8');
}

test('care team save success dialog uses the saved member name and success styling', () => {
  const careTeam = source('src/pages/CareTeamPage.jsx');
  const styles = source('src/styles/app.css');

  assert.match(careTeam, /title: `\$\{updatedMember\.name\} Saved`/);
  assert.match(careTeam, /message: `\$\{updatedMember\.name\} was saved\.`/);
  assert.match(careTeam, /variant="success"/);
  assert.doesNotMatch(careTeam, /Care Team Member Saved/);
  assert.doesNotMatch(careTeam, /Care team member was saved\./);
  assert.match(styles, /\.dialog--success\s*\{\s*border-color: var\(--color-success\);\s*background: var\(--color-success-bg\);/);
});
