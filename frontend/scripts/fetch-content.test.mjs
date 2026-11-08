// Unit tests for the build's content snapshot (D25). A local HTTP server stands in for the
// content API; the real one is checked by the backend's integration tests and the acceptance run.
// Run: npm run test:scripts. Examples: docs/examples/home.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fetchContent, writeSnapshot } from './fetch-content.mjs';

const heroIn = (lang) => ({ headline: `headline ${lang}`, lede: `lede ${lang}` });
const headIn = (lang) => ({ eyebrow: `eyebrow ${lang}`, heading: 'Software', intro: `intro ${lang}` });
const leadIn = (lang) => ({ kicker: `kicker ${lang}`, labels: { question: `question ${lang}` } });
const workIn = (lang) => ({ heading: `heading ${lang}`, rows: [{ id: 'reticulatep' }] });
const howIn = (lang) => ({ heading: `heading ${lang}`, steps: [{ title: `title ${lang}` }] });
const paperIn = (lang) => ({ eyebrow: `eyebrow ${lang}`, year: 2026 });
const proofIn = (lang) => ({ kicker: `kicker ${lang}` });

// Answers GET /api/content/{page}/{section}?lang=xx from `stored`; anything else is 404.
async function fakeApi(stored) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const [, , , page, section] = url.pathname.split('/');
    const body = stored[page]?.[section]?.[url.searchParams.get('lang')];
    res.writeHead(body ? 200 : 404, { 'Content-Type': 'application/json' });
    res.end(body ? JSON.stringify(body) : '');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

test('the snapshot holds every section of every language as the API answers it', async (t) => {
  const stored = everything();
  const api = await fakeApi(stored);
  t.after(api.close);

  assert.deepEqual(await fetchContent(api.url), stored);
});

test('HOME-HERO-06: a hero missing in de stops the build, naming page, section and language', async (t) => {
  const api = await fakeApi({ home: { hero: { en: heroIn('en'), pt: heroIn('pt') } } });
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page home, section hero, language de (404)',
  });
});

test('SW-PAGE-09: a Software head missing in de stops the build, naming page, section and language', async (t) => {
  const hero = { en: heroIn('en'), de: heroIn('de'), pt: heroIn('pt') };
  const api = await fakeApi({ home: { hero }, software: { head: { en: headIn('en'), pt: headIn('pt') } } });
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page software, section head, language de (404)',
  });
});

test('SW-PAGE-09: a Software lead missing in pt stops the build, naming page, section and language', async (t) => {
  const all = (make) => ({ en: make('en'), de: make('de'), pt: make('pt') });
  const api = await fakeApi({
    home: { hero: all(heroIn) },
    software: { head: all(headIn), lead: { en: leadIn('en'), de: leadIn('de') } },
  });
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page software, section lead, language pt (404)',
  });
});

test('SW-PAGE-09: a Software work missing in de stops the build, naming page, section and language', async (t) => {
  const all = (make) => ({ en: make('en'), de: make('de'), pt: make('pt') });
  const api = await fakeApi({
    home: { hero: all(heroIn) },
    software: { head: all(headIn), lead: all(leadIn), work: { en: workIn('en'), pt: workIn('pt') } },
  });
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page software, section work, language de (404)',
  });
});

test('SW-PAGE-09: a Software how missing in pt stops the build, naming page, section and language', async (t) => {
  const all = (make) => ({ en: make('en'), de: make('de'), pt: make('pt') });
  const api = await fakeApi({
    home: { hero: all(heroIn) },
    software: { head: all(headIn), lead: all(leadIn), work: all(workIn), how: { en: howIn('en'), de: howIn('de') } },
  });
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page software, section how, language pt (404)',
  });
});

// Every section the snapshot asks for, in every language, from one test API (D30: shared/paper).
const everything = () => {
  const all = (make) => ({ en: make('en'), de: make('de'), pt: make('pt') });
  return {
    home: { hero: all(heroIn) },
    shared: { paper: all(paperIn) },
    software: { head: all(headIn), lead: all(leadIn), work: all(workIn), how: all(howIn), proof: all(proofIn) },
  };
};

test('SW-PAGE-09 (D30): the shared paper labels missing in pt stop the build, naming page, section and language', async (t) => {
  const stored = everything();
  delete stored.shared.paper.pt;
  const api = await fakeApi(stored);
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page shared, section paper, language pt (404)',
  });
});

test('SW-PAGE-09: the Software band missing in de stops the build, naming page, section and language', async (t) => {
  const stored = everything();
  delete stored.software.proof.de;
  const api = await fakeApi(stored);
  t.after(api.close);

  await assert.rejects(fetchContent(api.url), {
    message: 'No content for page software, section proof, language de (404)',
  });
});

test('SW-PAGE-14 (D21): the snapshot is written as one file per page, each with only its own sections', (t) => {
  const dir = mkdtempSync(join(import.meta.dirname, '.tmp-snapshot-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const snapshot = { home: { hero: { en: heroIn('en') } }, software: { head: { en: headIn('en') } } };

  writeSnapshot(snapshot, dir);

  assert.deepEqual(readdirSync(dir).toSorted(), ['home.json', 'software.json']);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'home.json'), 'utf8')), snapshot.home);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'software.json'), 'utf8')), snapshot.software);
});

test('HOME-HERO-17: an API that cannot be reached stops the build, naming its URL', async () => {
  const api = await fakeApi({});
  api.close(); // the port is now free: nothing answers there

  await assert.rejects(fetchContent(api.url), {
    message: `The content API cannot be reached at ${api.url}/api/content/home/hero?lang=en`,
  });
});
