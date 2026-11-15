// The living glaze (docs/examples/theme.md, slice 1): the table and the engine, the minute injected.
// No real clock. Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { checkTable, themeAt } from '../src/app/services/glaze.mjs';

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

test('THEME-P-07: a glaze missing a token, or with a token not in the map, is refused by name', () => {
  const without = structuredClone(table);
  delete without.glazes.amarelo.c.edge;
  assert.throws(() => checkTable(without), /glaze amarelo has no edge/);

  const extra = structuredClone(table);
  extra.glazes.cobalto.c.teal = '#006a6a';
  assert.throws(() => checkTable(extra), /glaze cobalto has teal, which the map does not name/);

  assert.doesNotThrow(() => checkTable(table));
});

// hh:mm as minutes of the day: the clock injected.
const at = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
// The 14 tokens of a result, without the footer's and band's.
const fourteen = (hex) => Object.fromEntries(Object.keys(table.map).map((k) => [k, hex[k]]));

test('THEME-01: at lunchtime the site wears Cobalto, exactly as its table', () => {
  const glaze = themeAt(table, at('12:30'));
  assert.deepEqual(
    { hex: fourteen(glaze.hex ?? {}), mode: glaze.mode, moved: glaze.moved },
    { hex: table.glazes.cobalto.c, mode: 'light', moved: [] },
  );
});

test('THEME-03: morning, early evening and evening each wear their own glaze, exactly as its table', () => {
  const glazes = ['06:30', '19:00', '20:00'].map((t) => {
    const glaze = themeAt(table, at(t));
    return { hex: fourteen(glaze.hex), mode: glaze.mode, moved: glaze.moved };
  });
  const { manganes, amarelo, manganesNoite } = table.glazes;
  assert.deepEqual(glazes, [
    { hex: manganes.c, mode: 'light', moved: [] },
    { hex: amarelo.c, mode: 'light', moved: [] },
    { hex: manganesNoite.c, mode: 'dark', moved: [] },
  ]);
});

test('THEME-14: halfway from Manganês to Cobalto, each token is the Oklab midpoint of the two', () => {
  const study = mockupEngine().themeAt(at('08:15'));
  const glaze = themeAt(table, at('08:15'));
  assert.equal(glaze.hex.bg, '#ededf3');
  assert.deepEqual(
    { hex: fourteen(glaze.hex), mode: glaze.mode, moved: glaze.moved },
    { hex: json(study.hex), mode: 'light', moved: [] },
  );
});

const INKS = ['heading', 'body', 'muted', 'accent', 'accentHover', 'ochre', 'ochreText', 'edge', 'onAccent'];
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

test('THEME-12: in the two crossings the ground fades every minute and the inks switch once', () => {
  const { manganesNoite, manganes, amarelo } = table.glazes;
  // [from, to, the side before the switch, the minute it switches, the side after]
  const crossings = [
    ['06:00', '06:30', manganesNoite, '06:15', manganes],
    ['19:30', '20:00', amarelo, '19:46', manganesNoite],
  ];
  const seen = [];
  for (const [from, to] of crossings) {
    for (let m = at(from); m <= at(to); m++) {
      const glaze = themeAt(table, m);
      const inks = INKS.filter((k) => !glaze.moved.includes(k)).map((k) => [k, glaze.hex[k]]);
      const ground = m > at(from) && glaze.hex.bg === themeAt(table, m - 1).hex.bg ? 'still' : 'moved';
      seen.push({ at: hhmm(m), mode: glaze.mode, ground, inks: Object.fromEntries(inks) });
    }
  }
  const want = seen.map(({ at: t, inks }) => {
    const [, , before, switchAt, after] = crossings.find(([f, to]) => t >= f && t <= to);
    const side = at(t) < at(switchAt) ? before : after;
    const inkSide = Object.fromEntries(Object.keys(inks).map((k) => [k, side.c[k]]));
    return { at: t, mode: side.mode, ground: 'moved', inks: inkSide };
  });
  assert.deepEqual(seen, want);

  const switches = [];
  for (let m = 1; m < 1440; m++)
    if (themeAt(table, m).mode !== themeAt(table, m - 1).mode) switches.push(hhmm(m));
  assert.deepEqual(switches, ['06:15', '19:46']);
});

// WCAG 2 contrast of two #rrggbb colours, written here apart from the engine's.
const luminance = (hex) => {
  const lin = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};
const ratio = (p, q) => {
  const [x, y] = [luminance(p), luminance(q)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

test('THEME-13: a colour too faint for its ground is darkened only until it reads, the rest left as is', () => {
  const faint = '#a0a8b0';
  const c = { ...table.glazes.cobalto.c, muted: faint };
  const one = { ...table, glazes: { test: { name: 'Test', mode: 'light', c } }, keys: [[0, 'test'], [24, 'test']] };
  assert.ok(ratio(faint, c.bg) < 2.2, `the test's muted should start near 2:1, is ${ratio(faint, c.bg)}`);

  const glaze = themeAt(one, at('12:30'));
  const worst = Math.min(ratio(glaze.hex.muted, c.bg), ratio(glaze.hex.muted, c.surface));
  assert.deepEqual(
    {
      moved: glaze.moved,
      readable: worst >= 4.5,
      onlyJust: worst < 4.6,
      towardBlack: luminance(glaze.hex.muted) < luminance(faint),
      rest: fourteen({ ...glaze.hex, muted: faint }),
    },
    { moved: ['muted'], readable: true, onlyJust: true, towardBlack: true, rest: c },
  );
});

test('THEME-02: in the middle of the night the site wears Vidrado nocturno, its edge lifted to 3:1', () => {
  const { noite } = table.glazes;
  assert.equal(noite.c.edge, '#516b8b');
  assert.ok(ratio(noite.c.edge, noite.c.surface) < 3, "the table's night edge is below 3:1");
  const glaze = themeAt(table, at('02:00'));
  assert.deepEqual(
    { hex: fourteen(glaze.hex), mode: glaze.mode, moved: glaze.moved },
    { hex: { ...noite.c, edge: '#526c8c' }, mode: 'dark', moved: ['edge'] },
  );
  assert.ok(ratio('#526c8c', noite.c.surface) >= 3);
});
