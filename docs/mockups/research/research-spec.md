# Build spec: Research page

Chosen on 2026-11-08 and 2026-11-09: **one option, a landing page for the ICE 2026 paper** (R1 b,
and R2 to R8, Q1 to Q5 in `docs/examples/research.md`). Visual reference: `research.html` beside
this file, or `index.html` to switch language and theme; screenshots in `screenshots/`. Mock-ups are
not production code: do not copy their markup. The behaviour is in `docs/examples/research.md`,
built test-first.

## Purpose
The menu's Research link (SHELL-11), the lattice's `research` atom (HOME-HERO-09) and "All research"
on the theorem bands (SW-PROOF-02, HOME-PAPER-08) lead here. The page presents one paper, *Session
Type State Spaces Form Lattices* (ICE 2026): what it proves, how it was checked, and the tool behind
it. The full list of texts is the Writing page's; this page links there once. Readers, from
`docs/design.md`:
- **Researchers and reviewers** (laptop, often from the band, so they have seen Theorem 15): the
  abstract, all four results, the evidence, the PDF.
- **Hiring managers** (phone, a minute): that the engineering rests on a proof, checked by a tool he
  built.
- **Teams building AI agents:** why the protocols hold, and the tool that checks them.

## Sections, in order
1. **Head:** `PageHead` (`common/page-head/`, D13 in `writing.md`): eyebrow, `<h1>` "Research"
   (Q1 a), intro.
2. **The paper:** one card. Left: year · kind, `<h2>` title, author, venue, note, the PDF button.
   Right: the abstract, labelled, quoted in English (R2).
3. **What it proves:** `<h2>`; Theorem 15 in display type; then Definition 6, Lemma 8,
   Proposition 18 in a row of three, all open (R3). No figure (R4).
4. **How it was checked:** `<h2>`; four figures (108, 93, 15, Lean 4) as a `<dl>`; the evidence
   sentence the bands use.
5. **The tool:** `<h2>`; one row in the Software page's "More work" style: reticulateP.
6. **More research:** a quiet closing row: "Earlier papers (2007–2010)" to the Writing page, and
   ResearchGate (R5, R7 under R1 b; Q2 a, Q3).
7. **Footer:** the shared footer, unchanged.

**What's next** is in the mock-up as a placeholder (R6) and is **not built while there is no text**
(D1): the page goes from "The tool" to "More research", with no empty heading, no stored section,
and no key in the copy table. When the developer gives its text, it comes back as its own small
change (a section `research/next`, `{heading, text}`, between 5 and 6, with its cases), styled as
the mock-up's section without the placeholder frame: `<h2>`, then running text at 65 ch.

**Cite:** none now (Q5 a). A citation block comes with the EPTCS details, as its own change.

The header is the shared one; its Research link is current (`aria-current="page"`, D34 in
`software.md`). There is no theorem band: the page itself is the paper, and the band's "All
research" would point back here.

## Layout per width
One column of 1200 px, gutter 24 px (16 px under `Handset`), as on the other pages. Sections are
`padding-block: clamp(40px, 6vw, 80px)`, each after the first separated by a `--zc-border-light` rule.

| Part | 390 | 768 | 1280, 1440 |
|------|-----|-----|-----------|
| Head | Eyebrow, `<h1>`, intro, stacked | The same | The same, intro up to 40 rem |
| The paper | One column: meta, button full width, then a rule and the abstract | One column | Two columns `1fr` / `1.35fr`, a rule between; button at its width |
| What it proves | Theorem; the three statements stacked | Stacked | Theorem up to 52 rem; the three in three equal columns under a rule |
| How it was checked | Figures 2 × 2 | 2 × 2 | Four in a row |
| The tool | Kicker above the row | The same | Kicker in a `9rem` column, the row beside it |
| More research | Links stacked | In one line, wrapping | In one line |

The one-column switch is at 900 px; the full-width button under 480 px. Measured in the mock-up
(`screenshots/checks.txt`): page height 4,042 px at 390 (en), 4,184 px (de); 3,325 px at 1440 (en),
3,379 px (de), the "What's next" placeholder included (about 230 px less when it is left out).

## Components
- **Header, footer, language links, theme button, phone menu:** the existing shell (`shell.md`).
- **`PageHead`:** existing, unchanged.
- **New, `PaperCard`** (`pages/research/paper-card/`): an `<article>` on `--zc-bg-white`, 1 px
  `--zc-border-light` border, a 3 px `--zc-ochre` top, padding `clamp(24px, 3vw, 40px)` (16 px under
  480 px).
  - Year · kind: Plex Mono 0.8125 rem; year 500 in `--zc-text-heading`, kind in `--zc-ochre-text`.
  - Title: `<h2>`, Fraunces 600, `clamp(1.75rem, 3.4vw, 2.6rem)`, `text-wrap: balance`,
    `translate="no"`, `lang="en"` on de and pt.
  - Author: Archivo 0.9375 rem, in `<b>` 600 (the only author), `translate="no"`.
  - Venue: Plex Mono 0.8125 rem, `--zc-text-muted`, `overflow-wrap: anywhere`, `translate="no"`.
  - Note: as on the Writing page (ochre lozenge, Plex Mono 0.8125 rem).
  - Button: the site's filled button (`--zc-azul`, `--zc-on-accent`, min 44 px), to the PDF, same
    tab, `hreflang="en"`, `type="application/pdf"`. Never a Material button (the teal trap).
  - Abstract: an `<h3>` label (Plex Mono 0.8125 rem, `--zc-ochre-text`); on de and pt the language
    line ("Auf Englisch", "Em inglês"; Plex Mono, `--zc-text-muted`); then a `<blockquote>`,
    `translate="no"`, `lang="en"` on de and pt, Archivo 1 rem, line height 1.65, max 65 ch.
- **New, `PaperResults`** (`pages/research/paper-results/`): the section's `<h2>`; a `<blockquote>`
  for each statement, its label a `<p>` in Plex Mono 0.875 rem `--zc-ochre-text` (kind word,
  number, " · ", the name with `translate="no"`), its text a `<p>` with `translate="no"` and
  `lang="en"` on de and pt. Theorem: Fraunces 400, `clamp(1.6rem, 3.2vw, 2.5rem)`, line height 1.2.
  The three others: Fraunces 1.0625 rem, line height 1.5, in a grid under a rule. The texts are
  plain, as the band shows Theorem 15 (D4): no mono spans for the notation.
- **New, `PaperChecks`** (`pages/research/paper-checks/`): `<h2>`; a `<dl>`, each figure a `<div>`
  with a 3 px `--zc-azul` top rule, `<dt>` the value (Plex Mono 500, `clamp(2rem, 4vw, 3rem)`,
  `translate="no"`), `<dd>` the label (Archivo 0.9375 rem); then the evidence `<p>`, 1.0625 rem,
  max 65 ch. The figure's meaning is in its words, not its colour.
- **The tool row:** the Software page's `WorkRows` row style (kicker, `<h3>` title, text, stack, a
  link). Reuse the row's styles or component if it takes one row and a heading; do not copy.
  Its link is inside the site, same tab, no `↗`.
- **The closing row:** a `<section>` with a small `<h2>` (Plex Mono 0.8125 rem, uppercase,
  `--zc-text-muted`) above a `<ul>` of two links, each min 44 px; ResearchGate as Writing's outside
  links (new tab, `rel="noopener noreferrer"`, `↗` hidden, the hidden new-tab words).

## Content
Text comes from the content API through the build's snapshot, as the Software and Writing pages:
page `research` (`@page-content/research`, `RESEARCH_CONTENT`) for its own text, and page `shared`
(`SHARED_CONTENT`, D30 in `software.md`) for what the bands share: the paper's title, year, PDF,
the read label, the kind words, the evidence and the statements (D2). Titles, names, venues, the
abstract, the statements, the figures' values and link targets are the same in every language;
only labels are translated.

Sections of `research` (D2):
- `head`: `{eyebrow, heading, intro}` (`PageHead`); the title is `Alexandre Zua Caldeira — ${heading}`.
- `paper`: `{kind, note, inEnglish, abstractLabel, author, venue, abstract}`.
- `results`: `{heading}`.
- `checked`: `{heading, figures: [{value, label}] × 4}`.
- `tool`: `{heading, kicker, title, text, stack, link: {label, href}}`; `href` is the page name
  `software`, made into `/l/software` by `pagePath` (never a bare `/software`).
- `more`: `{heading, earlier, newTab, researchGate: {label, href}}`.

`shared/paper.statements` grows from Theorem 15 alone to the four (D3; it replaces D31 in
`software.md`). The band keeps showing only the theorem (it finds `kind: 'theorem'`).

### Copy (en / de / pt)
The drafts are built as drafted and listed for the developer's review on the preview (Q4), as the
Writing page's D9.

| Key | en | de | pt |
|-----|----|----|----|
| `title` | Alexandre Zua Caldeira — Research | Alexandre Zua Caldeira — Forschung | Alexandre Zua Caldeira — Investigação |
| `head.eyebrow` | One paper · ICE 2026 | Ein Paper · ICE 2026 | Um artigo · ICE 2026 |
| `head.heading` | Research | Forschung | Investigação |
| `head.intro` | The state space of every well-formed session type forms a lattice. This page is the paper that proves it: what it shows, how it was checked, and the tool behind it. | Der Zustandsraum jedes wohlgeformten Session-Typs bildet einen Verband. Diese Seite stellt das Paper vor, das es beweist: was es zeigt, wie es geprüft wurde und das Werkzeug dahinter. | O espaço de estados de todo o tipo de sessão bem formado forma um reticulado. Esta página apresenta o artigo que o prova: o que mostra, como foi verificado e a ferramenta por trás dele. |
| `paper.kind` | Workshop paper | Workshop-Paper | Artigo de workshop |
| `paper.note` | Camera-ready · to appear in EPTCS | Druckfassung · erscheint in EPTCS | Versão final · a publicar na EPTCS |
| `paper.inEnglish` | (not shown) In English | Auf Englisch | Em inglês |
| `paper.abstractLabel` | Abstract | Zusammenfassung | Resumo |
| `results.heading` | What it proves | Was es beweist | O que prova |
| `checked.heading` | How it was checked | Wie es geprüft wurde | Como foi verificado |
| `checked.figures[0].label` (108) | benchmark protocols, every one a lattice | Benchmark-Protokolle, jedes ein Verband | protocolos de referência, todos reticulados |
| `checked.figures[1].label` (93) | distributive | distributiv | distributivos |
| `checked.figures[2].label` (15) | not distributive | nicht distributiv | não distributivos |
| `checked.figures[3].label` (Lean 4) | mechanised proof | mechanisierter Beweis | prova mecanizada |
| `tool.heading` | The tool | Das Werkzeug | A ferramenta |
| `tool.kicker` | Verification tool | Verifikationswerkzeug | Ferramenta de verificação |
| `tool.text` | the Software page's reticulateP text, word for word (`R__software.sql`, D6) | the same, de | the same, pt |
| `tool.link.label` | reticulateP on the Software page | reticulateP auf der Software-Seite | O reticulateP na página de software |
| `more.heading` | More research | Mehr Forschung | Mais investigação |
| `more.earlier` | Earlier papers (2007–2010) | Frühere Paper (2007–2010) | Artigos anteriores (2007–2010) |
| `more.newTab` | opens in a new tab | öffnet in einem neuen Tab | abre num novo separador |

From `shared/paper` (already stored): `paperTitle`, `year`, `pdfUrl`, `read` ("Read the paper
(PDF)", "Paper lesen (PDF)", "Ler o artigo (PDF)"), `theorem`, `definition`, `lemma`,
`proposition`, `evidence`.

### Same in every language
| Field | Value | From |
|-------|-------|------|
| `paper.author` | Alexandre Zua Caldeira | `ContentService.publications[0]` |
| `paper.venue` | ICE 2026 · International Workshop on Interaction and Concurrency Experience | Writing's `ice2026` row |
| `paper.abstract` | "We prove that the state space of every well-formed session type, quotiented by strongly connected components, forms a bounded lattice; n-ary parallel composition yields product lattices. Two consequences follow: duality preserves the lattice up to isomorphism, and Gay–Hole width subtyping corresponds to lattice embedding for non-recursive types. We validate this on 108 benchmark protocols across networking, databases, distributed systems, AI, and fault tolerance: all form lattices, 93 distributive, 15 non-distributive. Mechanised in Lean 4 with two independently developed tool implementations." | `content.service.ts` line 95, word for word |
| `checked.figures[].value` | `108`, `93`, `15`, `Lean 4` | the abstract |
| `tool.title`, `tool.stack` | reticulateP, Python | `R__software.sql` |
| `more.researchGate` | ResearchGate, `https://www.researchgate.net/profile/Alexandre-Caldeira` | today's `research.html` line 39 |

### The four statements (`shared/paper.statements`, in this order; quoted from the paper)
| kind | number | name | text |
|------|--------|------|------|
| theorem | 15 | Reticulate Theorem | For every well-formed session type S, ℒ(S)/≡ is a bounded lattice. |
| definition | 6 | SCC quotient | The SCC quotient ℒ(S)/≡ identifies mutually reachable states, collapsing each recursion cycle to one class. It is ordered by [s₁] ≤ [s₂] iff s₂ ↠ s₁: a state is smaller when less of the protocol remains, so execution descends from q⊤ to q⊥. |
| lemma | 8 | End | ℒ(end)/≡ is a bounded lattice. |
| proposition | 18 | Duality isomorphism | For every well-formed session type S, there is a bounded-lattice isomorphism ℒ(S)/≡ ≅ ℒ(dual(S))/≡. |

Texts as in today's `pages/home/paper-statements/paper-statements.html` (lines 9, 18–22, 28,
34–35), without its markup. No session type program is shown, so reticulateP has nothing to check
here; `end` and `dual(S)` are the paper's own words.

## What goes
- The old page: `research.html`'s Material cards, the "Publications" heading and the ResearchGate
  `mat-stroked-button` (the teal trap), and the three older abstracts. `research.spec.ts` is
  replaced by the new specs.
- The i18n keys `research.subtitle`, `profilesHeading`, `publicationsHeading`, `paperLink` (D7).
  `nav.research` stays.
- `ContentService.publications` is no longer read by this page. It stays while the home page's old
  `paper-statements` reads it (D12 in `writing.md`), and goes with the home band.

## States
- **Long data:** the abstract (≈ 90 words) is the longest block: 15 lines at 390 px, 9 at 1440 in
  its column. The title wraps to three lines at 390, two at 1440.
- **German:** the longest page (4,184 px at 390). "Benchmark-Protokolle, jedes ein Verband" wraps to
  two lines under 108 at 1440, which is fine.
- **No empty, loading or error state:** prerendered from the snapshot; a missing language stops the
  build (D4 in `home.md`).
- **What's next:** absent until it has text (D1).

## Accessibility
- One `<h1>`; each section an `<h2>` (the paper's title is the paper section's `<h2>`); the abstract
  label and the tool's name are `<h3>`.
- The abstract and statements are `<blockquote>` with `translate="no"`, `lang="en"` on de and pt.
- Figures are a `<dl>`: the value is the term, its meaning the description.
- Every link and the button at least 44 px tall. The outside link says in words that it opens a new
  tab; the arrow is decorative.
- Measured in the mock-up, en, de, pt at 390 and 1440, light and dark: no horizontal scroll, no
  control under 44 px, lowest text contrast 4.91:1 in light (the ochre kicker), 5.36:1 in dark.
  The five glazes of the living theme are each kept at 4.5:1 by the glaze's own guard.

## Tokens used
`--zc-bg-warm`, `--zc-bg-white`, `--zc-border-light`, `--zc-text-heading`, `--zc-text-body`,
`--zc-text-muted`, `--zc-azul`, `--zc-azul-deep`, `--zc-on-accent`, `--zc-ochre`,
`--zc-ochre-text`, `--grout` (tile), the `--zc-space-*` scale, `--zc-font-heading`,
`--zc-font-body`, `--zc-font-mono`. No new token.

## Cases
`docs/examples/research.md`, IDs `RS-PAGE-nn`, `RS-HEAD-nn`, `RS-PAPER-nn`, `RS-RES-nn`,
`RS-CHECK-nn`, `RS-TOOL-nn`, `RS-MORE-nn`, with the slices.
