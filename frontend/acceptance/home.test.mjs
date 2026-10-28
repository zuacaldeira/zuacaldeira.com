// Acceptance tests for the home page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/home.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

test('HOME-PAGE-01: each language has its own home page with its lang attribute', () => {
  for (const lang of ['en', 'de', 'pt']) {
    assert.match(page(`${lang}/home`), new RegExp(`<html lang="${lang}"`));
  }
});
