// Acceptance tests for the site's languages, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/i18n.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');

// Copied from src/app/i18n/fr.ts before it was deleted (D6).
const FRENCH = ['Accueil', 'Bonjour, je suis', 'Chercheur. Développeur. Éducateur. Coureur.'];

const textFiles = readdirSync(browser, { recursive: true })
  .map(String)
  .filter((file) => /\.(js|html|json|txt|xml)$/.test(file));

// The minified scripts escape non-ASCII letters ("D\xE9veloppeur"); read them as written.
const unescape = (text) =>
  text.replace(/\\x([0-9a-fA-F]{2})|\\u([0-9a-fA-F]{4})/g, (_, x, u) =>
    String.fromCharCode(parseInt(x ?? u, 16)),
  );

test('I18N-01: no file of the built site contains French text', () => {
  const found = textFiles.flatMap((file) => {
    const text = unescape(readFileSync(join(browser, file), 'utf8'));
    return FRENCH.filter((marker) => text.includes(marker)).map((marker) => `${file}: ${marker}`);
  });
  assert.deepEqual(found, []);
});
