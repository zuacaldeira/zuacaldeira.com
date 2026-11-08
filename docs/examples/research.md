# Examples: Research page

Status: **decisions R1 to R8 answered by the developer on 2026-11-08; the mock-up is out for review.**
No cases yet: they follow the agreed mock-up and its spec, in the format of `writing.md`.

The Research page in three languages, at `/en/research`, `/de/research` and `/pt/research`
(menu: Research, Forschung, Investigação). It is in the menu since SHELL-11 but still the old page
(`frontend/src/app/pages/research/`). Mock-up: `docs/mockups/research/` (one option).

## Who reads it (from `docs/design.md`)

- **Researchers and reviewers** (laptop, from a paper or a talk): they arrive from "All research" on
  the home and Software bands, or the lattice's `research` atom, having seen Theorem 15 already.
  The page gives them the paper itself: abstract, all four results, how they were checked, the PDF.
- **Hiring managers:** a quick look that the engineering rests on a proof.
- **Teams building AI agents:** why the protocols hold, and the tool that checks them.

The Writing page lists every text; the Research page is about the ICE 2026 paper alone.

## Decisions

Answered by the developer on 2026-11-08:

- **R1: b,** a landing page for the ICE 2026 paper, *Session Type State Spaces Form Lattices*, alone
  (not a)'s page about the whole programme).
- **R2: a,** the abstract is shown in English on every page, as a quotation (`lang="en"`,
  `translate="no"`), with "Auf Englisch" / "Em inglês" on the German and Portuguese pages (as D10 in
  `writing.md`).
- **R3: a,** all four statements, open: Theorem 15, Definition 6, Lemma 8, Proposition 18, quoted
  from the paper (today's text in `pages/home/paper-statements/paper-statements.html`).
- **R4: a,** no figure for now.
- **R5: a, as far as it fits R1 b.** The 2007–2010 line (ConGu, FOOL, POPL) is not about the ICE
  paper, so it **leaves the page as a section**. What stays is one link at the end, "Earlier papers
  (2007–2010)" to the Writing page, where they are listed (D1, D3 in `writing.md`).
- **R6: a,** a "What's next" section, a plainly marked placeholder in the mock-up, built only if the
  developer gives it text. It fits R1 b as what follows from the paper.
- **R7: a, as far as it fits R1 b.** The profiles are not about the paper. In the mock-up they sit
  in a short closing row, "More research", beside the Writing link: ResearchGate (from today's page)
  and placeholders for ORCID, DBLP and Google Scholar, if the developer has them. Where they finally
  go is open (Q2 in the mock-up's index).
- **R8: a,** the Portuguese menu word stays "Investigação" (`pt.ts:8`), as the bands' "Toda a
  investigação".

Not applying with R1 b: the page's own copy of the four publications (already in Writing), and the
three older abstracts (they leave the site, as D4 in `writing.md` keeps abstracts off the list).
