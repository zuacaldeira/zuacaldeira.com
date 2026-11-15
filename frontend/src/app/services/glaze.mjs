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
