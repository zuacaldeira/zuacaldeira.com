// The living glaze (docs/examples/theme.md, slice 1): the table and the engine, the minute injected.
// No real clock. Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const frontend = join(import.meta.dirname, '..');
const table = JSON.parse(readFileSync(join(frontend, 'src/app/services/glaze.json'), 'utf8'));

// The mock-up's engine, from "The glaze engine" to the line before it reads the clock, run alone.
function mockupEngine() {
  const html = readFileSync(join(frontend, '../docs/mockups/home/home.html'), 'utf8');
  const start = html.indexOf('/* The glaze engine');
  const end = html.indexOf('const nowMin');
  assert.ok(start > 0 && end > start, 'the glaze engine is not where it was in home.html');
  const names = 'GLAZES, KEYS, GUARDS, MAP, STATE_MIN, themeAt';
  return runInNewContext(`${html.slice(start, end)}\n;({ ${names} })`, {});
}

const json = (value) => JSON.parse(JSON.stringify(value));

test('THEME-15: the glaze table is the one the mock-ups use', () => {
  const study = mockupEngine();
  const html = readFileSync(join(frontend, '../docs/mockups/home/home.html'), 'utf8');
  // The footer's gold and the mail button's label on it (D5, D13).
  const footGold = html.match(/--foot-gold:(#[0-9a-f]{6})/)?.[1];
  const footOnGold = html.match(/\.foot__mail\{[^}]*;color:(#[0-9a-f]{6})/)?.[1];
  assert.deepEqual(
    {
      glazes: Object.fromEntries(
        Object.entries(table.glazes ?? {}).map(([k, g]) => [k, { name: g.name, mode: g.mode, c: g.c }]),
      ),
      keys: table.keys,
      guards: table.guards,
      map: table.map,
      states: table.states,
      fixed: table.fixed,
    },
    {
      glazes: Object.fromEntries(
        Object.entries(json(study.GLAZES)).map(([k, g]) => [k, { name: g.name, mode: g.mode, c: g.c }]),
      ),
      keys: json(study.KEYS),
      guards: json(study.GUARDS),
      map: json(study.MAP),
      states: json(study.STATE_MIN),
      fixed: { footGold, footOnGold },
    },
  );
});
