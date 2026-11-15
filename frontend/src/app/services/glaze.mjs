// The living glaze's engine (docs/examples/theme.md). No imports: the table is passed in.

/** Refuses a table whose glazes do not hold exactly the map's tokens (THEME-P-07). */
export function checkTable(table) {
  const tokens = Object.keys(table.map);
  for (const [name, glaze] of Object.entries(table.glazes)) {
    for (const t of tokens) if (!(t in glaze.c)) throw new Error(`The glaze ${name} has no ${t}`);
    for (const t of Object.keys(glaze.c))
      if (!tokens.includes(t)) throw new Error(`The glaze ${name} has ${t}, which the map does not name`);
  }
}

/** The glaze at a minute of the visitor's day: the minute is passed in, never read from a clock. */
export function themeAt(table, minute) {
  const h = (((minute / 60) % 24) + 24) % 24;
  const keys = table.keys;
  let i = 0;
  while (i < keys.length - 2 && h >= keys[i + 1][0]) i++;
  const a = table.glazes[keys[i][1]];
  return { hex: { ...a.c }, mode: a.mode, moved: [] };
}
