"""Group the benchmark lattices into isomorphism classes.

Lattice isomorphism is order isomorphism, which is exactly digraph isomorphism of
the Hasse diagram — so no lattice-specific reasoning is needed here.

Two passes: colour refinement (1-WL) to bucket cheaply, then exact backtracking
inside each bucket. 1-WL alone is incomplete and does collide on posets, so it is
only ever used to narrow the search, never to decide.
"""

from collections import defaultdict


def build(nodes, cov):
    idx = {n: i for i, n in enumerate(sorted(nodes))}
    n = len(idx)
    out = [set() for _ in range(n)]
    inn = [set() for _ in range(n)]
    for a, b in cov:
        out[idx[a]].add(idx[b])
        inn[idx[b]].add(idx[a])
    return n, out, inn


def refine(n, out, inn):
    """Iterated colour refinement; returns a colour per vertex."""
    colour = [hash((len(inn[i]), len(out[i]))) for i in range(n)]
    for _ in range(n):
        nxt = []
        for i in range(n):
            sig = (
                colour[i],
                tuple(sorted(colour[j] for j in out[i])),
                tuple(sorted(colour[j] for j in inn[i])),
            )
            nxt.append(hash(sig))
        # compress to dense ints so hashes stay stable across graphs
        remap = {c: k for k, c in enumerate(sorted(set(nxt)))}
        nxt = [remap[c] for c in nxt]
        if nxt == colour:
            break
        colour = nxt
    return colour


def signature(n, out, inn):
    c = refine(n, out, inn)
    edges = sum(len(o) for o in out)
    return (n, edges, tuple(sorted(c)))


def isomorphic(g1, g2):
    """Exact digraph isomorphism by backtracking, constrained by refined colours."""
    n1, out1, inn1 = g1
    n2, out2, inn2 = g2
    if n1 != n2 or sum(map(len, out1)) != sum(map(len, out2)):
        return False
    c1, c2 = refine(*g1), refine(*g2)
    if sorted(c1) != sorted(c2):
        return False

    by_colour = defaultdict(list)
    for j in range(n2):
        by_colour[c2[j]].append(j)

    # hardest (rarest colour, highest degree) first prunes fastest
    order = sorted(
        range(n1), key=lambda i: (len(by_colour[c1[i]]), -(len(out1[i]) + len(inn1[i])))
    )
    mapping = {}
    used = set()

    def consistent(i, j):
        # For every already-mapped a->b, edge i->a must hold iff j->b holds, and
        # a->i iff b->j. Pair out1 with out2 and inn1 with inn2 — crossing them
        # (out2 against inn1) silently rejects even identical graphs.
        for a, b in mapping.items():
            if (a in out1[i]) != (b in out2[j]):
                return False
            if (a in inn1[i]) != (b in inn2[j]):
                return False
        return True

    def bt(k):
        if k == n1:
            return True
        i = order[k]
        for j in by_colour[c1[i]]:
            if j in used or not consistent(i, j):
                continue
            mapping[i] = j
            used.add(j)
            if bt(k + 1):
                return True
            del mapping[i]
            used.discard(j)
        return False

    return bt(0)


def classes(items):
    """items: list of dicts with 'nodes' and 'cov'. Returns list of classes."""
    buckets = defaultdict(list)
    for o in items:
        g = build(o["nodes"], [tuple(c) for c in o["cov"]])
        o["_g"] = g
        buckets[signature(*g)].append(o)

    out = []
    collisions = 0
    for sig, group in buckets.items():
        reps = []  # list of (representative, members)
        for o in group:
            for rep, members in reps:
                if isomorphic(rep["_g"], o["_g"]):
                    members.append(o)
                    break
            else:
                reps.append((o, [o]))
        if len(reps) > 1:
            collisions += len(reps) - 1
        out.extend(reps)
    return out, collisions
