#!/usr/bin/env python3
"""Regenerate lattices.json from the ICE 2026 benchmark corpus at rung R2'.

Requires the research repo (reticulateP). Point RESEARCH at it and run:
    RESEARCH=/path/to/SessionTypesResearch-ice2026 python3 scripts/lattice-wall/generate.py

Rung R2' is the exit-closure (saturating) construction: recursion is unfolded to
saturation before the state space is built, so cycles never collapse. Compared to
R1 (the bare folded SCC-quotient) it turns the 30 recursive protocols that R1
flattens into a chain into genuinely structured lattices. Output is the distinct
lattices up to isomorphism, with each one's distributivity and the protocols it
covers.
"""
import json, os, signal, sys, pathlib

RESEARCH = os.environ.get("RESEARCH", "/home/zuacaldeira/Development/research/SessionTypesResearch-ice2026")
sys.path.insert(0, str(pathlib.Path(RESEARCH) / "reticulateP"))
HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))

from reticulatep.parser import parse
from reticulatep.rung2 import build_statespace_rung2, CycleNotEliminated
from reticulatep.distributive_quotient import direct_distributivity_check as is_distributive
from tests.benchmarks.protocols import BENCHMARKS
from iso import classes

PER_PROTOCOL_SECS = 25


class Timeout(Exception):
    pass


signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(Timeout()))


def scc_hasse(ss):
    """SCC-quotient then transitive reduction — the Hasse diagram of the lattice."""
    edges = {(a, c) for a, _, c in ss.transitions}
    nodes = sorted(ss.states)
    adj = {s: [] for s in nodes}
    radj = {s: [] for s in nodes}
    for a, b in edges:
        adj[a].append(b)
        radj[b].append(a)
    seen, order = set(), []
    for s in nodes:
        if s in seen:
            continue
        st = [(s, iter(adj[s]))]
        seen.add(s)
        while st:
            n, it = st[-1]
            for m in it:
                if m not in seen:
                    seen.add(m)
                    st.append((m, iter(adj[m])))
                    break
            else:
                order.append(n)
                st.pop()
    comp, c = {}, 0
    for s in reversed(order):
        if s in comp:
            continue
        stk = [s]
        comp[s] = c
        while stk:
            n = stk.pop()
            for m in radj[n]:
                if m not in comp:
                    comp[m] = c
                    stk.append(m)
        c += 1
    qn = sorted(set(comp.values()))
    qe = {(comp[a], comp[b]) for a, b in edges if comp[a] != comp[b]}
    reach = {n: set() for n in qn}
    for a, b in qe:
        reach[a].add(b)
    changed = True
    while changed:
        changed = False
        for a in qn:
            add = set()
            for b in list(reach[a]):
                add |= reach[b]
            if not add <= reach[a]:
                reach[a] |= add
                changed = True
    cov = {(a, b) for a, b in qe if not any(b in reach[m] for m in reach[a] if m != b)}
    return dict(
        n=len(qn), e=len(cov), nodes=qn, cov=sorted(cov), top=comp[ss.top], bot=comp[ss.bottom]
    )


def main():
    built, skipped = [], []
    for bp in BENCHMARKS:
        try:
            signal.alarm(PER_PROTOCOL_SECS)
            ss = build_statespace_rung2(parse(bp.type_string))
            h = scc_hasse(ss)
            h["name"] = bp.name
            h["dist"] = bool(is_distributive(ss))
            built.append(h)
            signal.alarm(0)
        except (Timeout, CycleNotEliminated) as e:
            signal.alarm(0)
            skipped.append((bp.name, type(e).__name__))
        except Exception as e:  # noqa: BLE001 — record, never crash the batch
            signal.alarm(0)
            skipped.append((bp.name, type(e).__name__))

    reps, collisions = classes([dict(h) for h in built])
    out = []
    for rep, members in reps:
        rep = {k: v for k, v in rep.items() if k != "_g"}
        rep["count"] = len(members)
        rep["members"] = [m["name"] for m in members]
        out.append(rep)
    out.sort(key=lambda o: (o["n"], o["e"]))

    (HERE / "lattices.json").write_text(json.dumps(out, indent=0))
    bad = [r for r, ms in reps if len({m["dist"] for m in ms}) > 1]
    nd = sum(1 for o in out if not o["dist"])
    print(f"rung R2' (exit-closure)")
    print(f"  protocols built:   {len(built)} / {len(BENCHMARKS)}")
    if skipped:
        print(f"  skipped:           {len(skipped)}  ({', '.join(f'{n} [{w}]' for n, w in skipped)})")
    print(f"  distinct lattices: {len(out)}  ({nd} non-distributive)")
    print(f"  iso classes disagreeing on distributivity: {len(bad)} (must be 0)")
    print(f"  wrote {HERE / 'lattices.json'}")


if __name__ == "__main__":
    main()
