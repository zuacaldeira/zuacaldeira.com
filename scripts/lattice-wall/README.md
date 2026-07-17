# The lattice wall

The hero's wall is one tile per distinct lattice realised by the benchmark corpus of
**Session Type State Spaces Form Lattices** (ICE 2026, Urbino), at rung **R2′**.

```bash
python3 scripts/lattice-wall/render.py            # lattices.json -> component
```

## What the tiles mean

- The paper's 108 benchmark protocols are each turned into a lattice, then grouped by
  isomorphism. At rung R2′ they realise **74 distinct lattices**.
- Tiles are ordered by size, which reads as a gradient: chains, then lozenges, then
  dense product lattices.
- **47 of the 74 are non-distributive** and are drawn in ochre. Under R2′ the
  non-distributive lattices outnumber the distributive ones — the finer construction
  reveals obstructions that R1 folds away.
- Each tile's larger end dots are ⊤ (the protocol's initial state) and ⊥ (its terminal
  state). In this work ⊤ is where a protocol *starts*.

## Why R2′ and not R1

R1 is the bare folded SCC-quotient: it collapses every recursive cycle to a single
node, so 30 of the recursive protocols degenerate to the trivial two-element chain and
the wall repeats one drawing thirty times. **R2′** (exit-closure / saturating unfold)
cuts the recursion before building the state space, so those protocols keep their
structure. Concretely, swapping R1 → R2′ takes the wall from 41 distinct lattices (30
of them trivial chains) to 74 (one trivial), and from 15 non-distributive to 47.

## Regenerating lattices.json

`lattices.json` is derived data, checked in so the site builds without the research
repo. To regenerate it you need `reticulateP` from the ICE 2026 repository:

```bash
RESEARCH=/path/to/SessionTypesResearch-ice2026 python3 scripts/lattice-wall/generate.py
```

`generate.py` does, per protocol:

1. `parse` the type string, then `build_statespace_rung2` — the exit-closure (R2′)
   construction, which saturates recursion so the state space is acyclic.
2. SCC-quotient (identity on the acyclic graph) then transitive reduction — the
   lattice's Hasse diagram.
3. Classify with `direct_distributivity_check`.
4. Group by digraph isomorphism of the Hasse diagram (lattice isomorphism *is* order
   isomorphism). Colour refinement buckets candidates; an exact backtracking check
   decides — refinement alone is incomplete and must not decide on its own.

**Four protocols are excluded** (Leader Replication, Ion Channel (Na+/K+ Parallel),
Action Potential Full — exit-closure raises a `ValueError` obstruction; Polysome —
saturation exceeds the 25 s bound). The wall therefore covers 104 of the 108 protocols.

Sanity check worth repeating if you regenerate: no isomorphism class may disagree on
distributivity, since distributivity is an order invariant. `generate.py` asserts this.
