// The hero's wall is the data, drawn (D8 in docs/examples/research.md): render.py's output equals
// the checked-in file byte for byte. The Research wall, its second output, left with D26. Needs
// python3. Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const frontend = join(import.meta.dirname, '..');
const render = join(import.meta.dirname, 'lattice-wall/render.py');
// -B: no bytecode written next to the script; --print: to stdout, nothing written.
const printed = (wall) => execFileSync('python3', ['-B', render, '--print', wall], { encoding: 'utf8' });

test("D8: render.py's hero wall equals the checked-in file byte for byte", () => {
  const file = 'src/app/pages/home/hero/lattice-wall/lattice-wall.html';
  const checkedIn = join(frontend, file);
  assert.ok(existsSync(checkedIn), `no checked-in hero wall at ${file}`);
  // Line by line, so a difference shows where it is, not as a 200 KB diff.
  const want = printed('hero').split('\n');
  const have = readFileSync(checkedIn, 'utf8').split('\n');
  const at = want.findIndex((line, i) => line !== have[i]);
  assert.deepEqual(
    { firstDifference: at === -1 && want.length === have.length ? null : at + 1, file: have[at] },
    { firstDifference: null, file: want[at] },
    `${file} is not render.py's output (regenerate it, never edit it)`,
  );
});
