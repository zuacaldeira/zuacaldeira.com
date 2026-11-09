// The walls are the data, drawn (D8, D14 in docs/examples/research.md): render.py's two outputs
// equal the checked-in files byte for byte. Needs python3. Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const frontend = join(import.meta.dirname, '..');
const render = join(import.meta.dirname, 'lattice-wall/render.py');
// -B: no bytecode written next to the script; --print: to stdout, nothing written.
const printed = (wall) => execFileSync('python3', ['-B', render, '--print', wall], { encoding: 'utf8' });

for (const [id, wall, file] of [
  ['RS-WALL-03', 'research', 'src/app/pages/research/research-wall/research-wall.html'],
  ['RS-WALL-03 (D8: the hero untouched)', 'hero', 'src/app/pages/home/hero/lattice-wall/lattice-wall.html'],
]) {
  test(`${id}: render.py's ${wall} wall equals the checked-in file byte for byte`, () => {
    const checkedIn = join(frontend, file);
    assert.ok(existsSync(checkedIn), `no checked-in ${wall} wall at ${file}`);
    // Line by line, so a difference shows where it is, not as a 200 KB diff.
    const want = printed(wall).split('\n');
    const have = readFileSync(checkedIn, 'utf8').split('\n');
    const at = want.findIndex((line, i) => line !== have[i]);
    assert.deepEqual(
      { firstDifference: at === -1 && want.length === have.length ? null : at + 1, file: have[at] },
      { firstDifference: null, file: want[at] },
      `${file} is not render.py's output (regenerate it, never edit it)`,
    );
  });
}
