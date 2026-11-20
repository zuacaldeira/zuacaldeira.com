// Source checks for Material under the living glaze (slice 2 of docs/examples/theme.md): Material
// has no palette of its own (THEME-17, B1). Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = join(import.meta.dirname, '../src');
const theme = () => readFileSync(join(src, 'material-theme.scss'), 'utf8');

test('THEME-17: material-theme.scss names no palette of Material', () => {
  assert.deepEqual(theme().match(/\$[a-z-]*palette\b/g) ?? [], []);
});
