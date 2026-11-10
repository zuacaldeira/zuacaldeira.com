// Acceptance tests for the site's language rules, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: LANG-01 to 05 in
// docs/examples/language.md; the rules and the list of forbidden forms in docs/language.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { JSDOM } from 'jsdom';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const languageDoc = join(import.meta.dirname, '../../docs/language.md');

// The JSON block after "## Forbidden forms" in docs/language.md (LANG-05).
const rules = (() => {
  const doc = readFileSync(languageDoc, 'utf8');
  const section = doc.split('## Forbidden forms')[1] ?? '';
  const block = section.match(/```json\n(.*?)\n```/s)?.[1];
  return block ? JSON.parse(block) : { forbidden: [] };
})();

// Every built page whose <html lang> is de or pt, with its route (LANG-01).
const builtPages = (dir = browser) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return builtPages(path);
    if (entry.name !== 'index.html') return [];
    const html = readFileSync(path, 'utf8');
    const lang = html.match(/<html lang="([a-z]+)"/)?.[1];
    return lang === 'de' || lang === 'pt' ? [{ route: relative(browser, dir), lang, html }] : [];
  });

const squash = (text) => text.replace(/\s+/g, ' ').trim();

// The page's own-language text: what is marked English or not to be translated is left out (L5).
const ownText = ({ lang, html }) => {
  const { document } = new JSDOM(html).window;
  document
    .querySelectorAll(`script, style, noscript, [translate="no"], [lang]:not([lang^="${lang}"])`)
    .forEach((element) => element.remove());
  const walker = document.createTreeWalker(document.body, 4 /* NodeFilter.SHOW_TEXT */);
  const texts = [document.title];
  while (walker.nextNode()) texts.push(walker.currentNode.nodeValue);
  document.body
    .querySelectorAll('[alt], [aria-label]')
    .forEach((el) => texts.push(el.getAttribute('alt') ?? '', el.getAttribute('aria-label') ?? ''));
  const headings = [...document.body.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) =>
    squash(h.textContent),
  );
  return { text: squash(texts.join(' ')), headings };
};

const pages = builtPages().map((page) => ({ ...page, ...ownText(page) }));

const escape = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s');
const wholeWords = (source, ignoreCase) =>
  new RegExp(`(?<!\\p{L})(?:${source})(?!\\p{L})`, ignoreCase ? 'giu' : 'gu');

test('LANG-05: the forbidden forms come from docs/language.md', () => {
  assert.ok(rules.forbidden.length > 0, 'no forbidden forms read from docs/language.md');
  assert.ok(rules.sentenceCase, 'no sentence-case rule read from docs/language.md');
});

test('LANG-01: every German and Portuguese page is read', () => {
  for (const lang of ['de', 'pt']) {
    const routes = pages.filter((page) => page.lang === lang).map((page) => page.route);
    for (const page of ['home', 'about', 'contact', 'research', 'running', 'software', 'writing']) {
      assert.ok(routes.includes(`${lang}/${page}`), `${lang}/${page} not read`);
    }
  }
  assert.ok(!pages.some((page) => page.route === 'de'), '/de/index.html is English, not German');
});

for (const entry of rules.forbidden) {
  const shown = entry.words ? entry.words.join('", "') : entry.pattern;
  test(`LANG-02 ${entry.id}: no ${entry.lang.join(' or ')} page uses "${shown}" (${entry.findings.join(', ') || 'guard'})`, () => {
    const regex = wholeWords(entry.pattern ?? entry.words.map(escape).join('|'), entry.ignoreCase);
    const allowed = new Set((entry.allow ?? []).map((word) => word.toLowerCase()));
    const found = pages
      .filter((page) => entry.lang.includes(page.lang))
      .flatMap((page) =>
        [...page.text.matchAll(regex)]
          .map(([match]) => match)
          .filter((match) => !allowed.has(match.toLowerCase()))
          .map((match) => `${page.route}: ${match}`),
      );
    assert.deepEqual([...new Set(found)], [], entry.why);
  });
}

test(`LANG-04: ${rules.sentenceCase?.lang.join(' and ')} headings are in sentence case (${rules.sentenceCase?.findings.join(', ')})`, () => {
  const names = new Set(rules.sentenceCase.names);
  const found = pages
    .filter((page) => rules.sentenceCase.lang.includes(page.lang))
    .flatMap((page) =>
      page.headings
        .filter((heading) =>
          heading
            .split(' ')
            .some((token, i, tokens) => {
              const word = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
              const afterBreak = i === 0 || /[:·—]$/.test(tokens[i - 1]);
              return (
                /^\p{Lu}/u.test(word) &&
                /\p{Ll}/u.test(word) &&
                !/\p{N}/u.test(word) &&
                !names.has(word) &&
                !afterBreak
              );
            }),
        )
        .map((heading) => `${page.route}: ${heading}`),
    );
  assert.deepEqual([...new Set(found)], [], 'L10: headings in sentence case');
});
