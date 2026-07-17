# The lattice wall

The hero's wall is one tile per distinct lattice realised by the benchmark corpus of
**Session Type State Spaces Form Lattices** (ICE 2026, Urbino).

```bash
python3 scripts/lattice-wall/render.py
```

## What the tiles mean

- **108** benchmark protocols collapse to **41** distinct lattices up to isomorphism.
  30 protocols share the trivial two-element chain (Java Iterator, Reentrant Lock,
  DNS Resolver, Circuit Breaker…), so the wall shows each *shape* once rather than
  repeating the same drawing thirty times.
- Tiles are ordered by size, which reads as a gradient: chains, then lozenges, then
  the dense product lattices that only appear once `‖` is involved.
- **15 of the 41 are non-distributive** and are drawn in ochre. Every non-distributive
  protocol has a unique shape — the repetition is entirely among the distributive ones.
- Each tile's larger end dots are ⊤ (the protocol's initial state) and ⊥ (its terminal
  state). Note the direction: in this work ⊤ is where a protocol *starts*.

## Regenerating lattices.json

`lattices.json` is derived data, checked in so this repo builds without the research
repo. It was produced from `reticulateP` in the ICE 2026 repository:

1. For each protocol in `reticulateP/tests/benchmarks/protocols.py`, `parse` the type
   string and `build_statespace` it.
2. Quotient by strongly connected components, then take the transitive reduction —
   that is the lattice's Hasse diagram.
3. Classify with `reticulatep.distributive_quotient.direct_distributivity_check`.
   This reproduces the paper's split exactly: **93 distributive, 15 non-distributive**.
4. Group by digraph isomorphism of the Hasse diagram (lattice isomorphism *is* order
   isomorphism). Colour refinement buckets candidates; an exact backtracking check
   decides. Refinement alone is incomplete and merged one pair that the exact check
   correctly separated, so it must not be used on its own.

Sanity check worth repeating if you regenerate: no isomorphism class may disagree on
distributivity, since distributivity is an order invariant.
