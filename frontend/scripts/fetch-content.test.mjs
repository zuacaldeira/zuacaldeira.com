// Unit tests for the build's content snapshot (D25). A local HTTP server stands in for the
// content API; the real one is checked by the backend's integration tests and the acceptance run.
// Run: npm run test:scripts. Examples: docs/examples/home.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { fetchContent } from './fetch-content.mjs';

const heroIn = (lang) => ({ headline: `headline ${lang}`, lede: `lede ${lang}` });

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

test('the snapshot holds the hero of every language as the API answers it', async (t) => {
  const stored = { home: { hero: { en: heroIn('en'), de: heroIn('de'), pt: heroIn('pt') } } };
  const api = await fakeApi(stored);
  t.after(api.close);

  assert.deepEqual(await fetchContent(api.url), stored);
});
