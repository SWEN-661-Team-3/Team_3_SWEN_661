import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const source = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const mobileNavigation = source('src/components/MobileNavigation.jsx');
const header = source('src/components/AppHeader.jsx');
const navigationItems = source('src/components/navigationItems.js');
const styles = source('src/styles/app.css');

test('mobile navigation uses the shared desktop navigation configuration in the required order', () => {
  assert.match(navigationItems, /export const navigationItems = \[\s*\{ label: "Today's Plan"[\s\S]*\{ label: 'Care Team'[\s\S]*\{ label: 'Settings'[\s\S]*\{ label: 'Emergency'/);
  assert.match(header, /<MobileNavigation items=\{navigationItems\}/);
});

test('hamburger is semantic and exposes its open state to assistive technology', () => {
  assert.match(mobileNavigation, /<button[\s\S]*type="button"[\s\S]*aria-label=\{isOpen \? 'Close navigation menu' : 'Open navigation menu'\}[\s\S]*aria-expanded=\{isOpen\}[\s\S]*aria-controls="mobile-navigation"/);
  assert.match(mobileNavigation, /<nav id="mobile-navigation" aria-label="Primary"/);
});

test('menu closes after navigation, Escape, outside click, and a desktop resize', () => {
  assert.match(mobileNavigation, /onClick=\{\(\) => setIsOpen\(false\)\}/);
  assert.match(mobileNavigation, /event\.key === 'Escape'/);
  assert.match(mobileNavigation, /pointerdown/);
  assert.match(mobileNavigation, /window\.matchMedia/);
  assert.match(mobileNavigation, /if \(!event\.matches\) setIsOpen\(false\)/);
});

test('the 720px mobile breakpoint hides desktop navigation and presents the panel below the header', () => {
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.desktop-navigation\s*\{\s*display: none;/);
  assert.match(styles, /\.mobile-navigation__panel[\s\S]*top: calc\(100% \+ var\(--space-2\)\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
