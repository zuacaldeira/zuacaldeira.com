#!/usr/bin/env python3
"""Render the hero's lattice wall from the benchmark data in lattices.json.

    python3 scripts/lattice-wall/render.py

`lattices.json` holds the distinct lattices — up to isomorphism — realised by the
benchmark corpus of "Session Type State Spaces Form Lattices" (ICE 2026) at rung
R2′. It is derived data, checked in so this repo does not need the research repo
to build. To regenerate it, see README.md in this directory.

Colours are CSS classes, never literals: the wall has to follow the site's
light/dark theme, and the blue/ochre split carries meaning (ochre = the lattice
is not distributive) so a single-colour CSS mask cannot express it.
"""

import json
import math
import pathlib

TILE = 100
COLS = 14
PAD = 15
HERE = pathlib.Path(__file__).parent


def rank_layout(o):
    """Place each node by its longest path from the top — a Hasse diagram's natural y."""
    cov = [tuple(c) for c in o["cov"]]
    rank = {n: 0 for n in o["nodes"]}
    for _ in range(len(o["nodes"])):
        for a, b in cov:
            if rank[b] < rank[a] + 1:
                rank[b] = rank[a] + 1
    rows = {}
    for n in o["nodes"]:
        rows.setdefault(rank[n], []).append(n)
    maxr = max(rows) or 1
    pos = {}
    for r, ns in rows.items():
        ns.sort()
        for i, n in enumerate(ns):
            pos[n] = ((i + 1) / (len(ns) + 1), r / maxr if maxr else 0.5)
    return pos


def render(lattices):
    lattices = sorted(lattices, key=lambda o: (o["n"], o["e"]))
    rows = [lattices[i : i + COLS] for i in range(0, len(lattices), COLS)]
    w, h = COLS * TILE, len(rows) * TILE
    total = sum(o["count"] for o in lattices)
    nd = sum(1 for o in lattices if not o["dist"])

    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" class="wall" role="img" '
        f'aria-labelledby="wall-title">',
        f'<title id="wall-title">The {len(lattices)} distinct lattices realised by the {total} '
        f"benchmark protocols of Session Type State Spaces Form Lattices, ordered by size. "
        f"The {nd} non-distributive ones are marked in a different colour.</title>",
    ]
    for r, row in enumerate(rows):
        # The tile count rarely fills the last row; centring the remainder makes it
        # read as composition rather than a missing tile.
        off = (COLS - len(row)) * TILE / 2
        for c, o in enumerate(row):
            cx, cy = off + c * TILE, r * TILE
            pos = rank_layout(o)

            def P(n):
                x, y = pos[n]
                return (cx + PAD + x * (TILE - 2 * PAD), cy + PAD + y * (TILE - 2 * PAD))

            cls = "t" if o["dist"] else "t nd"
            out.append(f'<g class="{cls}">')
            out.append(
                f'<rect x="{cx + 1}" y="{cy + 1}" width="{TILE - 2}" height="{TILE - 2}"/>'
            )
            for a, b in o["cov"]:
                x1, y1 = P(a)
                x2, y2 = P(b)
                out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>')
            for n in o["nodes"]:
                x, y = P(n)
                end = n in (o["top"], o["bot"])
                cls = ' class="e"' if end else ""
                # radius as an attribute too: the CSS `r` property is not honoured by
                # every engine, so the SVG must stand on its own without the stylesheet.
                out.append(f'<circle{cls} cx="{x:.1f}" cy="{y:.1f}" r="{2.5 if end else 1.5}"/>')
            out.append("</g>")
    out.append("</svg>")
    return "\n".join(out)


OUT = (
    HERE.parents[1]
    / "src/app/pages/home/hero/lattice-wall/lattice-wall.html"
)


if __name__ == "__main__":
    svg = render(json.loads((HERE / "lattices.json").read_text()))
    OUT.write_text(svg + "\n")
    print(f"wrote {OUT} ({len(svg) // 1024} KB)")
