# The Run line shown on the Software page (SW-LEAD-04), exactly as on the page, whitespace aside.
# It is line 10 of the tdd-lab's types/agent/workflow/ext-generic.st, a line of that checked
# workflow type, not a whole program: Code, Fix and Green are defined in the lab's file.
# The whole type was checked in the lab with the pinned reticulateP (main 7d20ba416) on 2026-11-08:
# 56 states, 89 transitions, a lattice (D5 in docs/examples/software.md).
# reticulateP's parser has no comments; like its fixture loader, the tests skip lines starting
# with # and take the first other line (D17).
Run = &{runTest: +{RED: Code, WRONG_RED: Fix, GREEN: Green}}
